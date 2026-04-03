/**
 * CSE 310 Module 2 - JavaScript Password Generator
 * Author: Osuagwu Prince Henry
 * Date: 3/20/2026
 * 
 * This is the main entry point for the password generator application.
 * It handles user interaction and orchestrates the password generation process.
 */

// Import required modules
const readlineSync = require('readline-sync');
const PasswordGenerator = require('./generator');
const FileHandler = require('./fileHandler');

// Optional: Import chalk for colored console output (if installed)
let chalk;
try {
    chalk = require('chalk');
} catch (error) {
    // Fallback if chalk is not installed - provides basic console colors
    chalk = {
        green: (text) => text,
        red: (text) => text,
        yellow: (text) => text,
        cyan: (text) => text,
        bold: (text) => text
    };
}

/**
 * Main Application Class
 * Manages the entire password generator application flow
 */
class PasswordGeneratorApp {
    
    /**
     * Constructor - Initializes generator and file handler
     */
    constructor() {
        this.generator = new PasswordGenerator();
        this.fileHandler = new FileHandler();
        this.history = []; // Store generated passwords for this session
    }
    
    /**
     * Displays welcome banner with styling
     */
    displayWelcome() {
        console.log(chalk.cyan('\n' + '='.repeat(60)));
        console.log(chalk.green.bold('        🔐 SECURE PASSWORD GENERATOR 🔐'));
        console.log(chalk.green.bold('        CSE 310 - Module 2 (JavaScript)'));
        console.log(chalk.cyan('='.repeat(60) + '\n'));
        console.log('Generate cryptographically secure passwords with');
        console.log('customizable character sets and strength guarantees.\n');
    }
    
    /**
     * Displays help menu with usage instructions
     */
    displayHelp() {
        console.log(chalk.yellow('\n📖 HELP MENU\n'));
        console.log('Password length: 8-32 characters (recommended: 12+)');
        console.log('Character types: Uppercase, Lowercase, Numbers, Special');
        console.log('Special characters: ! @ # $ % ^ & *');
        console.log('\nTips for strong passwords:');
        console.log('  • Use all 4 character types');
        console.log('  • Minimum 12 characters');
        console.log('  • Avoid personal information');
        console.log('\nPress any key to continue...');
        readlineSync.keyInPause();
    }
    
    /**
     * Collects all user preferences with validation
     * @returns {Object} User preferences object
     */
    getUserPreferences() {
        console.log(chalk.yellow('\n📋 CONFIGURATION\n'));
        
        // Show help option
        const showHelp = readlineSync.keyInYNStrict('Would you like to see help tips?');
        if (showHelp) {
            this.displayHelp();
        }
        
        // Get password length with validation
        let length;
        while (true) {
            length = readlineSync.questionInt(
                chalk.cyan('Password length (8-32 characters): '),
                { limitMin: 8, limitMax: 32 }
            );
            
            if (length >= 8 && length <= 32) {
                break;
            }
            console.log(chalk.red('❌ Length must be between 8 and 32!'));
        }
        
        // Get character type preferences
        console.log(chalk.yellow('\nSelect character types to include:'));
        const includeUppercase = readlineSync.keyInYNStrict(
            chalk.cyan('Include uppercase letters (A-Z)?')
        );
        const includeLowercase = readlineSync.keyInYNStrict(
            chalk.cyan('Include lowercase letters (a-z)?')
        );
        const includeNumbers = readlineSync.keyInYNStrict(
            chalk.cyan('Include numbers (0-9)?')
        );
        const includeSpecial = readlineSync.keyInYNStrict(
            chalk.cyan('Include special characters (!@#$%^&*)?')
        );
        
        // Validate at least one type selected
        if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSpecial) {
            console.log(chalk.red('\n❌ ERROR: You must select at least one character type!'));
            console.log(chalk.yellow('Please try again.\n'));
            return this.getUserPreferences(); // Recursive retry
        }
        
        // Get number of passwords
        let count;
        while (true) {
            count = readlineSync.questionInt(
                chalk.cyan('\nNumber of passwords to generate (1-10): '),
                { limitMin: 1, limitMax: 10 }
            );
            
            if (count >= 1 && count <= 10) {
                break;
            }
            console.log(chalk.red('❌ Count must be between 1 and 10!'));
        }
        
        // Ask about saving to file
        const saveToFile = readlineSync.keyInYNStrict(
            chalk.cyan('\nSave passwords to a file?')
        );
        
        // Return complete preferences object
        return {
            length,
            includeUppercase,
            includeLowercase,
            includeNumbers,
            includeSpecial,
            count,
            saveToFile
        };
    }
    
    /**
     * Displays generated passwords in a formatted way
     * @param {Array} passwords - Array of generated passwords
     */
    displayGeneratedPasswords(passwords) {
        console.log(chalk.green('\n✅ PASSWORDS GENERATED SUCCESSFULLY!\n'));
        console.log(chalk.cyan('─'.repeat(50)));
        
        passwords.forEach((password, index) => {
            // Mask password for display (show only first/last chars if long)
            const displayPassword = password.length > 20 
                ? `${password.substring(0, 10)}...${password.substring(password.length - 10)}`
                : password;
            
            console.log(`${chalk.yellow(`#${index + 1}`)}: ${chalk.green.bold(displayPassword)}`);
            console.log(`   Length: ${password.length} chars | Strength: ${this.calculateStrength(password)}`);
        });
        
        console.log(chalk.cyan('─'.repeat(50)));
        
        // Add to history
        this.history.push(...passwords);
    }
    
    /**
     * Calculates password strength rating
     * @param {string} password - Password to evaluate
     * @returns {string} Strength rating
     */
    calculateStrength(password) {
        let score = 0;
        
        if (password.length >= 12) score++;
        if (password.length >= 16) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[!@#$%^&*]/.test(password)) score++;
        
        if (score >= 6) return '🔒 VERY STRONG';
        if (score >= 4) return '🔒 STRONG';
        if (score >= 2) return '⚠️ MODERATE';
        return '⚠️ WEAK';
    }
    
    /**
     * Gets description of selected character types
     * @param {Object} prefs - User preferences
     * @returns {string} Description string
     */
    getCharacterTypesDescription(prefs) {
        const types = [];
        if (prefs.includeUppercase) types.push('Uppercase (A-Z)');
        if (prefs.includeLowercase) types.push('Lowercase (a-z)');
        if (prefs.includeNumbers) types.push('Numbers (0-9)');
        if (prefs.includeSpecial) types.push('Special (!@#$%^&*)');
        return types.join(', ');
    }
    
    /**
     * Displays session summary with statistics
     */
    displaySessionSummary() {
        if (this.history.length === 0) return;
        
        console.log(chalk.cyan('\n📊 SESSION SUMMARY\n'));
        console.log(`Total passwords generated: ${chalk.yellow(this.history.length)}`);
        
        const avgLength = Math.round(this.history.reduce((sum, p) => sum + p.length, 0) / this.history.length);
        console.log(`Average password length: ${chalk.yellow(avgLength)}`);
        
        const strongCount = this.history.filter(p => this.calculateStrength(p).includes('STRONG')).length;
        console.log(`Strong passwords: ${chalk.green(strongCount)}/${this.history.length}`);
    }
    
    /**
     * Main application loop - handles the entire user experience
     */
    async run() {
        this.displayWelcome();
        
        let running = true;
        
        while (running) {
            try {
                // Step 1: Get user preferences
                const preferences = this.getUserPreferences();
                
                // Step 2: Show generation progress
                console.log(chalk.yellow('\n🔧 Generating passwords...'));
                
                // Step 3: Generate passwords
                const startTime = Date.now();
                const passwords = this.generator.generateMultiplePasswords(
                    preferences.count,
                    preferences.length,
                    preferences.includeUppercase,
                    preferences.includeLowercase,
                    preferences.includeNumbers,
                    preferences.includeSpecial
                );
                const endTime = Date.now();
                
                // Step 4: Display results
                this.displayGeneratedPasswords(passwords);
                console.log(chalk.gray(`Generated in ${endTime - startTime}ms`));
                
                // Step 5: Save to file if requested
                if (preferences.saveToFile) {
                    const metadata = {
                        length: preferences.length,
                        types: this.getCharacterTypesDescription(preferences),
                        timestamp: new Date().toISOString()
                    };
                    
                    const saved = this.fileHandler.savePasswords(passwords, metadata);
                    if (saved) {
                        console.log(chalk.green(`\n💾 Passwords saved to: ${this.fileHandler.filename}`));
                        console.log(chalk.gray(`   File size: ${this.fileHandler.getFileSize()} bytes`));
                    }
                }
                
                // Step 6: Show options menu
                console.log(chalk.yellow('\n📋 OPTIONS:'));
                console.log('  1. Generate more passwords');
                console.log('  2. View session history');
                console.log('  3. Exit');
                
                const choice = readlineSync.questionInt('Choose (1-3): ', { limitMin: 1, limitMax: 3 });
                
                if (choice === 2) {
                    this.displaySessionSummary();
                    console.log(chalk.gray('\nPress any key to continue...'));
                    readlineSync.keyInPause();
                } else if (choice === 3) {
                    running = false;
                    this.displaySessionSummary();
                    console.log(chalk.cyan('\n👋 Thank you for using Password Generator!'));
                    console.log(chalk.gray('Stay secure! 🔐\n'));
                }
                // Choice 1 continues the loop
                
            } catch (error) {
                console.error(chalk.red(`\n❌ ERROR: ${error.message}`));
                console.log(chalk.yellow('Please check your input and try again.\n'));
                
                const retry = readlineSync.keyInYNStrict('Would you like to try again?');
                if (!retry) {
                    running = false;
                    console.log(chalk.cyan('\n👋 Goodbye!\n'));
                }
            }
        }
    }
}

// Create and run the application
const app = new PasswordGeneratorApp();
app.run();

// Export for testing purposes
module.exports = PasswordGeneratorApp;