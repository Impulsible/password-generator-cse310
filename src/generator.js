/**
 * Password Generator Module
 * Handles all password generation logic using cryptographic randomness
 * Author: Osuagwu Prince Henry
 * Date: 3/20/2026
 */

const crypto = require('crypto');

/**
 * PasswordGenerator Class
 * Provides methods to generate secure passwords with various options
 */
class PasswordGenerator {
    
    /**
     * Constructor - Initializes character sets
     */
    constructor() {
        // Define available character sets
        this.characterSets = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            special: '!@#$%^&*'
        };
        
        // Store generation statistics
        this.stats = {
            totalGenerated: 0,
            byType: {
                uppercase: 0,
                lowercase: 0,
                numbers: 0,
                special: 0
            }
        };
    }
    
    /**
     * Gets a cryptographically random character from a given set
     * Uses crypto.randomBytes for true randomness (not Math.random)
     * @param {string} charSet - String containing allowed characters
     * @returns {string} Random character from the set
     */
    getRandomCharacter(charSet) {
        if (!charSet || charSet.length === 0) {
            throw new Error('Character set cannot be empty');
        }
        
        // Generate cryptographically secure random bytes
        const randomBytes = crypto.randomBytes(4);
        // Convert to integer and modulo by set length
        const randomIndex = randomBytes.readUInt32BE(0) % charSet.length;
        return charSet[randomIndex];
    }
    
    /**
     * Builds the complete character pool based on user selections
     * @param {boolean} includeUppercase - Include A-Z
     * @param {boolean} includeLowercase - Include a-z
     * @param {boolean} includeNumbers - Include 0-9
     * @param {boolean} includeSpecial - Include !@#$%^&*
     * @returns {string} Combined character pool
     */
    buildCharacterPool(includeUppercase, includeLowercase, includeNumbers, includeSpecial) {
        let pool = '';
        
        if (includeUppercase) {
            pool += this.characterSets.uppercase;
            this.stats.byType.uppercase++;
        }
        if (includeLowercase) {
            pool += this.characterSets.lowercase;
            this.stats.byType.lowercase++;
        }
        if (includeNumbers) {
            pool += this.characterSets.numbers;
            this.stats.byType.numbers++;
        }
        if (includeSpecial) {
            pool += this.characterSets.special;
            this.stats.byType.special++;
        }
        
        return pool;
    }
    
    /**
     * Ensures at least one character from each selected type appears
     * This guarantees password strength by preventing all characters from one type
     * @param {number} length - Password length
     * @param {boolean} includeUppercase - Include uppercase
     * @param {boolean} includeLowercase - Include lowercase
     * @param {boolean} includeNumbers - Include numbers
     * @param {boolean} includeSpecial - Include special
     * @returns {Array} Array of required characters
     */
    ensureTypeCoverage(length, includeUppercase, includeLowercase, includeNumbers, includeSpecial) {
        const requiredChars = [];
        
        // Add one required character from each selected type
        if (includeUppercase) {
            requiredChars.push(this.getRandomCharacter(this.characterSets.uppercase));
        }
        if (includeLowercase) {
            requiredChars.push(this.getRandomCharacter(this.characterSets.lowercase));
        }
        if (includeNumbers) {
            requiredChars.push(this.getRandomCharacter(this.characterSets.numbers));
        }
        if (includeSpecial) {
            requiredChars.push(this.getRandomCharacter(this.characterSets.special));
        }
        
        // Validate that we don't require more characters than password length
        if (requiredChars.length > length) {
            throw new Error(`Cannot guarantee ${requiredChars.length} character types in a ${length}-character password`);
        }
        
        return requiredChars;
    }
    
    /**
     * Shuffles an array using Fisher-Yates algorithm with crypto randomness
     * This ensures characters are randomly distributed throughout the password
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array
     */
    shuffleArray(array) {
        const shuffled = [...array];
        
        for (let i = shuffled.length - 1; i > 0; i--) {
            // Use crypto for true randomness in shuffle
            const randomBytes = crypto.randomBytes(4);
            const j = randomBytes.readUInt32BE(0) % (i + 1);
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        return shuffled;
    }
    
    /**
     * Generates a single password with specified parameters
     * @param {number} length - Desired password length (8-32)
     * @param {boolean} includeUppercase - Include uppercase letters
     * @param {boolean} includeLowercase - Include lowercase letters
     * @param {boolean} includeNumbers - Include numbers
     * @param {boolean} includeSpecial - Include special characters
     * @returns {string} Generated password
     */
    generatePassword(length, includeUppercase, includeLowercase, includeNumbers, includeSpecial) {
        // Validate input
        if (length < 8 || length > 32) {
            throw new Error('Password length must be between 8 and 32');
        }
        
        // Build the character pool
        const pool = this.buildCharacterPool(
            includeUppercase, includeLowercase, includeNumbers, includeSpecial
        );
        
        // Validate that at least one character type is selected
        if (pool.length === 0) {
            throw new Error('At least one character type must be selected');
        }
        
        // Get required characters for type coverage
        let passwordChars = this.ensureTypeCoverage(
            length, includeUppercase, includeLowercase, includeNumbers, includeSpecial
        );
        
        // Fill remaining characters randomly from the pool
        const remainingLength = length - passwordChars.length;
        for (let i = 0; i < remainingLength; i++) {
            passwordChars.push(this.getRandomCharacter(pool));
        }
        
        // Shuffle to mix character types throughout the password
        passwordChars = this.shuffleArray(passwordChars);
        
        // Update statistics
        this.stats.totalGenerated++;
        
        return passwordChars.join('');
    }
    
    /**
     * Generates multiple passwords at once
     * @param {number} count - Number of passwords to generate (1-10)
     * @param {number} length - Length of each password
     * @param {boolean} includeUppercase - Include uppercase
     * @param {boolean} includeLowercase - Include lowercase
     * @param {boolean} includeNumbers - Include numbers
     * @param {boolean} includeSpecial - Include special
     * @returns {Array} Array of generated passwords
     */
    generateMultiplePasswords(count, length, includeUppercase, includeLowercase, includeNumbers, includeSpecial) {
        // Validate count
        if (count < 1 || count > 10) {
            throw new Error('Password count must be between 1 and 10');
        }
        
        const passwords = [];
        const errors = [];
        
        for (let i = 0; i < count; i++) {
            try {
                const password = this.generatePassword(
                    length, includeUppercase, includeLowercase, includeNumbers, includeSpecial
                );
                passwords.push(password);
            } catch (error) {
                errors.push(`Password ${i + 1}: ${error.message}`);
            }
        }
        
        // If there were errors but some passwords generated, log them
        if (errors.length > 0 && passwords.length === 0) {
            throw new Error(`Generation failed: ${errors.join('; ')}`);
        }
        
        return passwords;
    }
    
    /**
     * Validates a password against criteria
     * @param {string} password - Password to validate
     * @param {Object} criteria - Validation criteria
     * @returns {Object} Validation result with details
     */
    validatePassword(password, criteria) {
        const result = {
            isValid: true,
            errors: [],
            details: {
                length: password.length,
                hasUppercase: /[A-Z]/.test(password),
                hasLowercase: /[a-z]/.test(password),
                hasNumbers: /[0-9]/.test(password),
                hasSpecial: /[!@#$%^&*]/.test(password)
            }
        };
        
        // Check length
        if (criteria.minLength && password.length < criteria.minLength) {
            result.isValid = false;
            result.errors.push(`Password length (${password.length}) is less than minimum (${criteria.minLength})`);
        }
        
        if (criteria.maxLength && password.length > criteria.maxLength) {
            result.isValid = false;
            result.errors.push(`Password length (${password.length}) exceeds maximum (${criteria.maxLength})`);
        }
        
        // Check character type requirements
        if (criteria.requireUppercase && !result.details.hasUppercase) {
            result.isValid = false;
            result.errors.push('Password missing uppercase letter');
        }
        
        if (criteria.requireLowercase && !result.details.hasLowercase) {
            result.isValid = false;
            result.errors.push('Password missing lowercase letter');
        }
        
        if (criteria.requireNumbers && !result.details.hasNumbers) {
            result.isValid = false;
            result.errors.push('Password missing number');
        }
        
        if (criteria.requireSpecial && !result.details.hasSpecial) {
            result.isValid = false;
            result.errors.push('Password missing special character');
        }
        
        return result;
    }
    
    /**
     * Gets generation statistics
     * @returns {Object} Statistics object
     */
    getStats() {
        return { ...this.stats };
    }
    
    /**
     * Resets statistics counter
     */
    resetStats() {
        this.stats = {
            totalGenerated: 0,
            byType: {
                uppercase: 0,
                lowercase: 0,
                numbers: 0,
                special: 0
            }
        };
    }
}

module.exports = PasswordGenerator;