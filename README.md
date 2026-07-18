# TrafficShield - Smart Helmet Detection System

A comprehensive traffic enforcement management application for automated helmet violation detection and ticketing. Built with React and Next.js 16, this system helps Traffic Management Officers efficiently process helmet violation cases.

## Features

### 🔐 Authentication
- Mock/Demo authentication system (client-side for prototyping)
- Two user roles: Officer and Supervisor
- Persistent login using localStorage
- Secure logout functionality

**Demo Credentials:**
- Officer: `demo@traffic.gov.ph` / `demo123`
- Supervisor: `supervisor@traffic.gov.ph` / `demo123`

### 📊 Dashboard
- **Key Metrics Cards**
  - Total Violations (148)
  - Today's Violations (10)
  - Tickets Issued (89)
  - Pending Review (35)

- **Interactive Charts**
  - Violations Trend (Line Chart) - Daily violations and resolutions over the past week
  - Violation Status Distribution (Pie Chart) - Current status breakdown
  - Violations by Location (Bar Chart) - Top enforcement areas

### 🚗 Violations Management
- **Sortable Data Table** with realistic Philippine context:
  - License plate numbers (Philippine format)
  - Violation timestamps
  - Locations (EDSA, Commonwealth Ave, BGC, etc.)
  - Assigned officer names
  - Case status (Pending Review, Verified, Ticket Issued, Appealed)

- **Advanced Filtering**
  - Search by plate number, location, or officer name
  - Filter by violation status
  - Sortable columns

### 📹 Video Upload
- **Manual Location Entry** - Officers must manually enter the violation location (required field)
- Quick-select common location buttons (EDSA Makati, BGC Taguig, Commonwealth Ave, etc.)
- Custom location text input for flexibility
- Location validation and display
- Drag-and-drop video upload interface
- Support for MP4, MOV, AVI, MKV formats
- Max file size: 500 MB
- Simulated upload progress tracking
- Violation detection results display with location
- Actions for review and ticket creation

### 📋 Data Privacy Compliance
- Full Philippine Data Privacy Act (RA 10173) compliance documentation
- Clear data collection disclosures
- User rights information
- Data retention policies
- Contact information for privacy concerns
- National Privacy Commission (NPC) resources

### 🎨 User Interface
- **Professional Government Theme**
  - Orange (#ea580c) primary color for authority
  - Clean, organized layout
  - Responsive sidebar navigation
  - Mobile-friendly design

- **Responsive Design**
  - Desktop-first approach
  - Mobile sidebar menu
  - Optimized for all screen sizes

## Tech Stack

- **Frontend:** React 19.2, Next.js 16 (App Router)
- **Styling:** Tailwind CSS with custom theme
- **Charts & Visualization:** Recharts
- **Icons:** Lucide React
- **UI Components:** shadcn/ui (Card, Button, Input, Badge)
- **State Management:** React Context API
- **Build Tool:** Turbopack (Next.js 16 default)

## Project Structure

```
app/
├── layout.tsx                 # Root layout with auth provider
├── page.tsx                   # Home (redirects to login)
├── login/page.tsx            # Login page
├── signup/page.tsx           # Signup page
└── dashboard/
    ├── layout.tsx            # Protected dashboard layout
    ├── page.tsx              # Main dashboard
    ├── violations/page.tsx    # Violations table and management
    ├── upload/page.tsx       # Video upload interface
    └── privacy/page.tsx      # Data privacy documentation

components/
├── sidebar.tsx               # Navigation sidebar
└── ui/                       # shadcn components
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    └── badge.tsx

lib/
├── auth-context.tsx          # Authentication context
├── mock-data.ts              # Mock violation data
└── utils.ts                  # Utility functions
```

## Installation & Setup

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Install Dependencies
```bash
pnpm install
```

### Start Development Server
```bash
pnpm dev
```

The application will start at `http://localhost:3000`

## Key Components

### AuthContext (`lib/auth-context.tsx`)
Manages user authentication state with:
- `user` - Current authenticated user
- `isAuthenticated` - Auth status flag
- `isLoading` - Loading state for hydration
- `login()` - Authenticate user
- `signup()` - Create new account
- `logout()` - Clear session

### Mock Data (`lib/mock-data.ts`)
Includes realistic Philippine context:
- 10 sample violations with authentic scenarios
- Metro Manila, Cebu, and Davao locations
- Dashboard statistics and trend data
- Location-based violation distribution

### Dashboard Analytics
- Real-time metric cards
- 7-day violation trend tracking
- Status distribution analysis
- Geographic violation heatmap

## Integration Ready Features

This frontend is designed for easy backend integration (FastAPI):

### API Ready Endpoints
The app is structured to easily integrate with:
- `POST /api/auth/login` - User authentication
- `POST /api/auth/signup` - User registration
- `GET /api/violations` - Fetch violations list
- `POST /api/videos/upload` - Video submission
- `GET /api/analytics` - Dashboard metrics

### Environment Variables (When Connecting Backend)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Data Privacy Features

- **RA 10173 Compliance** - Full Philippine Data Privacy Act adherence
- **Data Collection Transparency** - Clear disclosure of data usage
- **User Rights** - Right to access, rectify, and lodge complaints
- **Data Protection** - Security measures and retention policies
- **Contact Information** - Data Protection Officer details

## Demo Data

### Violation Examples
- **EDSA cor. Makati Ave** - 14:23:45
- **Commonwealth Ave, QC** - 15:45:12
- **BGC/Bonifacio Drive** - 16:10:30
- **Cebu Port Authority Road** - 10:45:00
- **Davao Boulevard** - 12:10:15

### Status Breakdown
- ✅ Verified: 64 cases
- ⏳ Pending Review: 35 cases
- 📋 Ticket Issued: 42 cases
- 📢 Appealed: 7 cases

## Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatible
- Sufficient color contrast ratios

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Guidelines

### Code Style
- TypeScript for type safety
- Functional components with React hooks
- Consistent naming conventions
- Comments for complex logic

### Component Organization
- One component per file
- Props interfaces clearly defined
- Reusable UI components in `/components/ui`
- Page-level components in route folders

### Styling
- Tailwind CSS utility classes
- CSS custom properties for theming
- Mobile-first responsive design
- Consistent spacing scale

## Future Enhancements

When connecting to FastAPI backend:
- Real-time violation data from AI model
- Live video processing with bounding boxes
- Actual license plate detection results
- Integration with vehicle registration database
- Real-time notifications for new violations
- User authentication with secure tokens
- Database persistence of violations
- Advanced filtering and export options

## License

Proprietary - For authorized traffic management use only

## Support

For issues or questions contact:
- Privacy Officer: privacy@traffic-enforcement.gov.ph
- Technical Support: support@traffic-enforcement.gov.ph

---

**Last Updated:** January 2024
**Version:** 1.0.0 - Frontend Prototype
