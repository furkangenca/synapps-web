# SynApps Frontend

SynApps is the frontend part of a modern and user-friendly project management application. It is built using Next.js 15, React 19, TypeScript, and Tailwind CSS. The interface is responsive, drag-and-drop enabled, and enhanced with Radix UI components.

## Project Structure

```
synapps-frontend/
├── app/ # Next.js 13+ app router structure
│ ├── (auth)/ # Authentication pages
│ ├── (dashboard)/ # Dashboard pages
│ └── api/ # API routes
├── components/ # Reusable UI components
│ ├── ui/ # Core UI components
│ ├── forms/ # Form components
│ └── shared/ # Shared components
├── hooks/ # Custom React hooks
├── lib/ # Helper functions and utilities
├── public/ # Static assets
├── styles/ # Global styles
├── types/ # TypeScript type definitions
└── config/ # Configuration files
```

## Technologies

- **Framework:** Next.js 15  
- **UI Library:** React 19  
- **Language:** TypeScript  
- **Styling:** Tailwind CSS  
- **UI Components:** Radix UI  
- **Form Management:** React Hook Form + Zod  
- **Drag and Drop:** @hello-pangea/dnd  
- **Theming:** next-themes  
- **Notifications:** Sonner  
- **Charts:** Recharts  
- **Date Handling:** date-fns

## Requirements

- Node.js 18.0.0 or higher  
- pnpm or npm

## Setup

1. Clone the repository:
```bash
git clone https://github.com/furkangenca/synapps-web.git
cd synapps-web/synapps-frontend
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Start the development server:
```bash
pnpm dev
# or
npm run dev
```

The app will run at http://localhost:3000

## Features

### Authentication
- User registration and login  
- JWT-based authentication  
- Session management

### Dashboard
- Project board view  
- Drag-and-drop task management  
- Real-time updates

### Task Management
- Create and edit tasks  
- Assign and track tasks  
- Update task status  
- Task filtering and search

### Project Boards
- Create and edit boards  
- Column management  
- Member management and authorization

### Notifications
- Real-time notifications  
- Task assignment alerts  
- System messages

## Development

### Commands

```bash
# Start development server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint check
pnpm lint
```

### Code Structure

- **Components:** Located in the `components/` directory  
  - `ui/`: Core UI components (button, input, card, etc.)  
  - `forms/`: Form-related components  
  - `shared/`: Common/shared components

- **Pages:** Located in the `app/` directory  
  - `(auth)/`: Authentication pages  
  - `(dashboard)/`: Dashboard pages

- **Hooks:** Located in the `hooks/` directory  
  - Custom React hooks  
  - API integration hooks

- **Types:** Located in the `types/` directory  
  - TypeScript interfaces and type definitions

## Style Guide

- Tailwind CSS is used  
- Radix UI components form the base  
- Responsive design principles applied  
- Dark/Light theme support is available

## Performance Optimizations

- Next.js Image optimization  
- Code splitting  
- Lazy loading  
- Memoization  
- Server-side rendering (SSR)

## Security

- CSRF protection  
- XSS protection  
- Input sanitization  
- Secure HTTP headers

## Deployment

1. Create a production build:
```bash
pnpm build
```

2. Start the production server:
```bash
pnpm start
```

## Contributing

1. Fork the repository  
2. Create your feature branch (`git checkout -b feature/amazing-feature`)  
3. Commit your changes (`git commit -m 'Add some amazing feature'`)  
4. Push your branch (`git push origin feature/amazing-feature`)  
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Furkan Genca - [@furkangenca](https://github.com/furkangenca)

Project Link: [https://github.com/furkangenca/synapps-web](https://github.com/furkangenca/synapps-web)
