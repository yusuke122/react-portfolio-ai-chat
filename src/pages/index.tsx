import React from 'react';

const HomePage: React.FC = () => {
    return (
        <div>
            <h1>Welcome to My React App</h1>
            <p>This is the home page.</p>
        </div>
    );
};

const AboutPage: React.FC = () => {
    return (
        <div>
            <h1>About Us</h1>
            <p>This is the about page.</p>
        </div>
    );
};

export { HomePage, AboutPage };