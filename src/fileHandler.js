/**
 * File Handler Module
 * Manages all file operations for saving passwords
 * Author: Osuagwu Prince Henry
 * Date: 3/20/2026
 */

const fs = require('fs');
const path = require('path');

/**
 * FileHandler Class
 * Handles saving passwords to files with proper formatting and error handling
 */
class FileHandler {
    
    /**
     * Constructor - Sets up file handler with default filename
     * @param {string} filename - Name of the output file (default: generated-passwords.txt)
     */
    constructor(filename = 'generated-passwords.txt') {
        this.filename = filename;
        this.filePath = path.join(process.cwd(), filename);
        this.backupPath = path.join(process.cwd(), `${filename}.backup`);
    }
    
    /**
     * Creates a timestamp for file headers
     * @returns {string} Formatted timestamp
     */
    getTimestamp() {
        const now = new Date();
        return now.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    }
    
    /**
     * Creates backup of existing file before overwriting
     * @returns {boolean} True if backup was created
     */
    createBackup() {
        try {
            if (fs.existsSync(this.filePath)) {
                fs.copyFileSync(this.filePath, this.backupPath);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Warning: Could not create backup: ${error.message}`);
            return false;
        }
    }
    
    /**
     * Saves passwords to file with formatted output
     * @param {Array} passwords - Array of passwords to save
     * @param {Object} metadata - Metadata about the generation
     * @returns {boolean} True if save was successful
     */
    savePasswords(passwords, metadata) {
        try {
            // Validate input
            if (!passwords || passwords.length === 0) {
                throw new Error('No passwords to save');
            }
            
            // Create backup before overwriting
            this.createBackup();
            
            // Build file content
            let content = [];
            
            // Header
            content.push('=' .repeat(70));
            content.push('SECURE PASSWORD GENERATOR - OUTPUT FILE');
            content.push('=' .repeat(70));
            content.push(`Generated: ${this.getTimestamp()}`);
            content.push(`Generator: CSE 310 Module 2 - JavaScript`);
            content.push(`Author: Osuagwu Prince Henry`);
            content.push('');
            
            // Metadata section
            content.push('─'.repeat(70));
            content.push('GENERATION SETTINGS');
            content.push('─'.repeat(70));
            content.push(`Password Length: ${metadata.length} characters`);
            content.push(`Character Types: ${metadata.types}`);
            content.push(`Total Passwords: ${passwords.length}`);
            if (metadata.timestamp) {
                content.push(`Session ID: ${metadata.timestamp}`);
            }
            content.push('');
            
            // Passwords section
            content.push('─'.repeat(70));
            content.push('GENERATED PASSWORDS');
            content.push('─'.repeat(70));
            content.push('');
            
            passwords.forEach((password, index) => {
                const strength = this.calculatePasswordStrength(password);
                content.push(`${(index + 1).toString().padStart(3)}. ${password}`);
                content.push(`     Length: ${password.length} | Strength: ${strength}`);
                content.push('');
            });
            
            // Footer
            content.push('─'.repeat(70));
            content.push('End of File');
            content.push(`Total lines: ${passwords.length} passwords`);
            content.push(`Generated on: ${new Date().toISOString()}`);
            content.push('=' .repeat(70));
            
            // Write to file
            const fileContent = content.join('\n');
            fs.writeFileSync(this.filePath, fileContent, 'utf8');
            
            return true;
            
        } catch (error) {
            console.error(`Failed to save passwords: ${error.message}`);
            return false;
        }
    }
    
    /**
     * Appends a single password to existing file
     * @param {string} password - Password to append
     * @returns {boolean} True if append was successful
     */
    appendPassword(password) {
        try {
            const timestamp = this.getTimestamp();
            const entry = `[${timestamp}] ${password}\n`;
            fs.appendFileSync(this.filePath, entry, 'utf8');
            return true;
        } catch (error) {
            console.error(`Failed to append password: ${error.message}`);
            return false;
        }
    }
    
    /**
     * Appends multiple passwords to existing file
     * @param {Array} passwords - Array of passwords to append
     * @returns {boolean} True if append was successful
     */
    appendPasswords(passwords) {
        try {
            const timestamp = this.getTimestamp();
            let content = `\n[${timestamp}] BATCH APPEND:\n`;
            
            passwords.forEach((password, index) => {
                content += `  ${index + 1}. ${password}\n`;
            });
            
            fs.appendFileSync(this.filePath, content, 'utf8');
            return true;
        } catch (error) {
            console.error(`Failed to append passwords: ${error.message}`);
            return false;
        }
    }
    
    /**
     * Reads passwords from file
     * @returns {Array} Array of passwords read from file
     */
    readPasswords() {
        try {
            if (!this.fileExists()) {
                return [];
            }
            
            const content = fs.readFileSync(this.filePath, 'utf8');
            const lines = content.split('\n');
            const passwords = [];
            
            // Extract passwords from formatted output
            for (const line of lines) {
                // Match lines that look like "  1. password"
                const match = line.match(/^\s*\d+\.\s+(.+)$/);
                if (match && !match[1].includes('Length:') && !match[1].includes('Strength:')) {
                    passwords.push(match[1]);
                }
            }
            
            return passwords;
        } catch (error) {
            console.error(`Failed to read passwords: ${error.message}`);
            return [];
        }
    }
    
    /**
     * Checks if output file exists
     * @returns {boolean} True if file exists
     */
    fileExists() {
        return fs.existsSync(this.filePath);
    }
    
    /**
     * Gets file size in bytes
     * @returns {number} File size or 0 if not exists
     */
    getFileSize() {
        if (!this.fileExists()) return 0;
        const stats = fs.statSync(this.filePath);
        return stats.size;
    }
    
    /**
     * Gets file creation time
     * @returns {string} Formatted creation time
     */
    getFileCreationTime() {
        if (!this.fileExists()) return 'N/A';
        const stats = fs.statSync(this.filePath);
        return stats.birthtime.toLocaleString();
    }
    
    /**
     * Clears the output file
     * @returns {boolean} True if clear was successful
     */
    clearFile() {
        try {
            if (this.fileExists()) {
                // Create backup before clearing
                this.createBackup();
                fs.unlinkSync(this.filePath);
            }
            return true;
        } catch (error) {
            console.error(`Failed to clear file: ${error.message}`);
            return false;
        }
    }
    
    /**
     * Calculates password strength for file output
     * @param {string} password - Password to evaluate
     * @returns {string} Strength rating
     */
    calculatePasswordStrength(password) {
        let score = 0;
        
        if (password.length >= 12) score++;
        if (password.length >= 16) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[!@#$%^&*]/.test(password)) score++;
        
        if (score >= 6) return 'VERY STRONG';
        if (score >= 4) return 'STRONG';
        if (score >= 2) return 'MODERATE';
        return 'WEAK';
    }
    
    /**
     * Restores from backup file
     * @returns {boolean} True if restore was successful
     */
    restoreFromBackup() {
        try {
            if (fs.existsSync(this.backupPath)) {
                fs.copyFileSync(this.backupPath, this.filePath);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Failed to restore backup: ${error.message}`);
            return false;
        }
    }
}

module.exports = FileHandler;