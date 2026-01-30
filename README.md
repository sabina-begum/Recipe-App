# CULINARIA - Professional Cooking Platform & Recipe Discovery

<div align="center">
  <img src="src/assets/foodie-logo-simple.svg" alt="CULINARIA Logo" width="120" height="120" />
  <h1>🍽️ CULINARIA</h1>
  <p><strong>Professional Cooking Platform & Recipe Discovery</strong></p>
  <p><strong>Live demo:</strong> <a href="https://merry-mandazi-9785be.netlify.app" target="_blank" rel="noopener noreferrer">merry-mandazi-9785be.netlify.app</a></p>
</div>

## 🌟 Features

### 🍳 Recipe Management

- **Professional Recipe Discovery**: Find recipes based on ingredients, dietary preferences, and cooking time
- **Advanced Search & Filtering**: Filter by cuisine, difficulty, cooking time, and dietary restrictions
- **Recipe Collections**: Create and organize custom recipe collections
- **Favorites System**: Save and manage your favorite recipes
- **Recipe Scaling**: Automatically adjust ingredient quantities for different serving sizes
- **User-Submitted Recipes**: Share your own recipes with the community

### 📅 Meal Planning

- **Interactive Calendar**: Plan your weekly meals with our intuitive calendar interface
- **Smart Recommendations**: Get personalized meal suggestions based on your preferences
- **Meal Plan Templates**: Use pre-built meal plans or create your own
- **Shopping List Generation**: Automatically generate shopping lists from your meal plans

### 📊 Nutrition Tracking

- **Real-time Nutrition Data**: Integrated with USDA FoodData Central API
- **Personalized Goals**: Set and track daily nutrition targets
- **Meal Logging**: Log your daily meals and track progress
- **Progress Visualization**: Beautiful charts and insights
- **Nutritional Recommendations**: Get personalized advice based on your goals

### 🛒 Shopping Lists

- **Smart List Generation**: Create shopping lists from recipes and meal plans
- **Category Organization**: Items automatically organized by store sections
- **Quantity Management**: Track quantities and mark items as purchased
- **List Sharing**: Share lists with family members

### 🔐 Security & Privacy

- **Enterprise-grade Security**: Comprehensive security measures and data protection
- **User Authentication**: Secure login and registration system
- **Data Encryption**: All sensitive data is encrypted
- **Privacy Controls**: Full control over your personal data
- **Rate Limiting**: Protection against abuse and spam

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account (for backend services)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/culinaria.git
   cd culinaria
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project
   - Enable Authentication, Firestore, and Storage
   - Copy your Firebase config to `.env.local`

4. **Set up environment variables**

   ```bash
   cp env.example .env.local
   ```

   Edit `.env.local` with your Firebase configuration, USDA API key, and optional social URLs (`VITE_GITHUB_URL`, `VITE_TWITTER_URL`, `VITE_LINKEDIN_URL`).

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **State Management**: React Context API
- **Nutrition API**: USDA FoodData Central
- **Deployment**: Vercel, Netlify, or Firebase Hosting

## 📱 Features Overview

### For Home Cooks

- Discover new recipes tailored to your preferences
- Plan weekly meals and generate shopping lists
- Track nutrition and maintain healthy eating habits
- Save and organize favorite recipes

### For Food Enthusiasts

- Share your own recipes with the community
- Create and manage recipe collections
- Rate and review recipes
- Explore diverse cuisines and cooking techniques

### For Health-Conscious Users

- Detailed nutrition information for every recipe
- Personalized nutrition goals and tracking
- Dietary restriction filtering
- Progress monitoring and insights

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run security:check` - Run security checks
- `npm run deploy` - Deploy to production

### Project Structure

```
src/
├── components/          # React components (Navbar, RecipeReviews, etc.)
│   ├── navbar/         # Navigation components
│   ├── home/           # Home page sections
│   └── ...
├── features/recipes/   # Recipe pages (Home, RecipeCard, etc.)
├── assets/             # Static assets (logos, favicons)
├── data/               # Static data (recipes, categories, etc.)
├── utils/              # Utility functions
├── services/           # API services (nutrition, etc.)
├── contexts/           # React contexts (Auth, DarkMode, Modal)
└── hooks/              # Custom React hooks
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

### Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## 📚 Documentation (project root)

| File                                   | Purpose                                     |
| -------------------------------------- | ------------------------------------------- |
| `DEPLOYMENT_GUIDE.md`                  | Deploy to Vercel, Netlify, Firebase         |
| `TROUBLESHOOTING.md`                   | Common dev/build issues                     |
| `NUTRITION_API.md`                     | USDA nutrition integration                  |
| `SECURITY.md` / `SECURITY_FEATURES.md` | Security and features                       |
| `LOGO_DOCUMENTATION.md`                | Culinaria logo usage                        |
| `BRAND_IMPLEMENTATION.md`              | Brand identity implementation               |
| `LOGO_DESIGN.md`                       | Legacy: Foodie logo reference (pre-rebrand) |
| `BRAND_NAME_OPTIONS.md`                | Legacy: Brand name options (reference)      |

## 🔒 Security Features

- **Input Validation**: Comprehensive client-side and server-side validation
- **Rate Limiting**: Protection against abuse and spam
- **Data Sanitization**: All user inputs are sanitized
- **Session Management**: Secure session handling
- **Error Boundaries**: Graceful error handling
- **Security Monitoring**: Real-time security monitoring

## 📄 License

This project is licensed under the Proprietary License - see the [LICENSE](LICENSE) file for details.

**Copyright © 2025 Sabina Begum. All rights reserved.**

## 🤝 Contributing

This is a proprietary project. For collaboration inquiries, please contact:

- **Email**: begumsabina81193@gmail.com
- **Developer**: Sabina Begum

## 📞 Support

For support and questions:

- **Email**: begumsabina81193@gmail.com
- **Documentation**: See markdown guides in the project root: `DEPLOYMENT_GUIDE.md`, `TROUBLESHOOTING.md`, `NUTRITION_API.md`, `SECURITY.md`, and related `*.md` files.

## 🙏 Acknowledgments

- USDA FoodData Central for nutrition data
- Firebase for backend services
- React and Vite communities
- All contributors and beta testers

---

<div align="center">
  <p>Made with ❤️ by Sabina Begum</p>
  <p><strong>CULINARIA</strong> - Professional Cooking Platform & Recipe Discovery</p>
</div>
