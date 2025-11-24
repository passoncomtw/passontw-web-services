// 應用程式主佈局 - 遵循 SRP 原則，只負責佈局結構

import React, { useState } from 'react'
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Store as StoreIcon,
  AccountCircle,
  Logout,
  Home as HomeIcon,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthRedux } from '../hooks/useAuthRedux'
import { useAuth } from '../hooks/useRedux'
import type { AppLayoutProps, DrawerItem } from '../types'

const drawerWidth = 240

/**
 * 麵包屑導航組件
 */
const BreadcrumbNavigation: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const getBreadcrumbItems = () => {
    const pathnames = location.pathname.split('/').filter((x) => x)
    
    if (pathnames.length === 0) {
      return []
    }
    
    const breadcrumbItems: Array<{
      label: string
      path: string
      icon?: React.ReactElement
    }> = [
      {
        label: '首頁',
        path: '/',
        icon: <HomeIcon fontSize="small" />,
      },
    ]
    
    pathnames.forEach((name, index) => {
      const path = `/${pathnames.slice(0, index + 1).join('/')}`
      let label = ''
      
      switch (name) {
        case 'merchants':
          label = '商家管理'
          break
        default:
          label = name
      }
      
      breadcrumbItems.push({
        label,
        path,
      })
    })
    
    return breadcrumbItems
  }
  
  const breadcrumbItems = getBreadcrumbItems()
  
  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1
        
        return (
          <Link
            key={item.path}
            color={isLast ? 'text.primary' : 'inherit'}
            underline="hover"
            onClick={() => !isLast && navigate(item.path)}
            sx={{
              cursor: isLast ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {item.icon}
            {item.label}
          </Link>
        )
      })}
    </Breadcrumbs>
  )
}

/**
 * 應用程式主佈局組件
 */
const AppLayout: React.FC<AppLayoutProps> = ({ children, title = '營運管理後台' }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuthRedux()
  const authState = useAuth()
  const user = authState?.user
  
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // 導航項目
  const drawerItems: DrawerItem[] = [
    {
      text: '商家管理',
      icon: <StoreIcon />,
      path: '/merchants',
      active: location.pathname === '/merchants',
    },
  ]

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleMenuClose()
    logout()
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  // 抽屜內容
  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          營運管理後台
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {drawerItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={item.active}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* 頂部導航欄 */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          
          {/* 使用者選單 */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuClick}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.name?.charAt(0) || <AccountCircle />}
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  {user?.name || '管理員'}
                  <Typography variant="body2" color="text.secondary">
                    {user?.email || 'admin@example.com'}
                  </Typography>
                </ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText>登出</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 側邊導航欄 */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* 主要內容區域 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <BreadcrumbNavigation />
        {children}
      </Box>
    </Box>
  )
}

export default AppLayout
