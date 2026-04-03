/**
 * Test Suite for Password Generator
 * Tests all functionality to ensure correctness
 * Author: Osuagwu Prince Henry
 * Date: 3/20/2026
 */

const PasswordGenerator = require('../src/generator');
const FileHandler = require('../src/fileHandler');
const fs = require('fs');

// Color helpers for test output
const colors = {
    green: (text) => `\x1b[32m${text}\x1b[0m`,
    red: (text) => `\x1b[31m${text}\x1b[0m`,
    yellow: (text) => `\x1b[33m${text}\x1b[0m`,
    cyan: (text) => `\x1b[36m${text}\x1b[0m`
};

let testsPassed = 0;
let testsFailed = 0;

/**
 * Assert function for testing
 */
function assert(condition, testName, message) {
    if (condition) {
        console.log(colors.green(`  ✅ ${testName}`));
        testsPassed++;
        return true;
    } else {
        console.log(colors.red(`  ❌ ${testName}: ${message}`));
        testsFailed++;
        return false;
    }
}

/**
 * Run all tests
 */
async function runTests() {
    console.log(colors.cyan('\n🧪 RUNNING TEST SUITE\n'));
    console.log(colors.yellow('=' .repeat(50)));
    
    // Test 1: Generator initialization
    console.log(colors.yellow('\n📦 GENERATOR TESTS\n'));
    const generator = new PasswordGenerator();
    assert(generator !== null, 'Generator initializes successfully', 'Generator failed to initialize');
    assert(generator.characterSets.uppercase === 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'Character sets defined', 'Character sets missing');
    
    // Test 2: Single password generation
    console.log(colors.yellow('\n🔐 PASSWORD GENERATION TESTS\n'));
    const testPassword = generator.generatePassword(12, true, true, true, true);
    assert(testPassword.length === 12, 'Generates correct length password', `Expected 12, got ${testPassword.length}`);
    assert(/[A-Z]/.test(testPassword), 'Contains uppercase letters', 'No uppercase found');
    assert(/[a-z]/.test(testPassword), 'Contains lowercase letters', 'No lowercase found');
    assert(/[0-9]/.test(testPassword), 'Contains numbers', 'No numbers found');
    assert(/[!@#$%^&*]/.test(testPassword), 'Contains special characters', 'No special chars found');
    
    // Test 3: Multiple password generation
    console.log(colors.yellow('\n📊 MULTIPLE PASSWORD TESTS\n'));
    const multiplePasswords = generator.generateMultiplePasswords(5, 10, true, true, true, false);
    assert(multiplePasswords.length === 5, 'Generates correct number of passwords', `Expected 5, got ${multiplePasswords.length}`);
    assert(multiplePasswords.every(p => p.length === 10), 'All passwords correct length', 'Some passwords wrong length');
    
    // Test 4: Character type exclusion
    console.log(colors.yellow('\n🚫 EXCLUSION TESTS\n'));
    const noUppercase = generator.generatePassword(10, false, true, true, true);
    assert(!/[A-Z]/.test(noUppercase), 'Excludes uppercase when requested', 'Uppercase found when excluded');
    
    const noLowercase = generator.generatePassword(10, true, false, true, true);
    assert(!/[a-z]/.test(noLowercase), 'Excludes lowercase when requested', 'Lowercase found when excluded');
    
    const noNumbers = generator.generatePassword(10, true, true, false, true);
    assert(!/[0-9]/.test(noNumbers), 'Excludes numbers when requested', 'Numbers found when excluded');
    
    const noSpecial = generator.generatePassword(10, true, true, true, false);
    assert(!/[!@#$%^&*]/.test(noSpecial), 'Excludes special when requested', 'Special chars found when excluded');
    
    // Test 5: Edge cases
    console.log(colors.yellow('\n⚠️ EDGE CASE TESTS\n'));
    
    // Test minimum length
    const minLength = generator.generatePassword(8, true, false, false, false);
    assert(minLength.length === 8, 'Handles minimum length (8)', `Got length ${minLength.length}`);
    
    // Test maximum length
    const maxLength = generator.generatePassword(32, true, true, true, true);
    assert(maxLength.length === 32, 'Handles maximum length (32)', `Got length ${maxLength.length}`);
    
    // Test error for invalid length (too short)
    let errorThrown = false;
    try {
        generator.generatePassword(5, true, true, true, true);
    } catch (error) {
        errorThrown = true;
    }
    assert(errorThrown, 'Throws error for length < 8', 'No error for invalid length');
    
    // Test error for invalid length (too long)
    errorThrown = false;
    try {
        generator.generatePassword(50, true, true, true, true);
    } catch (error) {
        errorThrown = true;
    }
    assert(errorThrown, 'Throws error for length > 32', 'No error for invalid length');
    
    // Test 6: Password validation
    console.log(colors.yellow('\n✅ VALIDATION TESTS\n'));
    const validation = generator.validatePassword('Abc123!@#', {
        minLength: 8,
        maxLength: 20,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecial: true
    });
    assert(validation.isValid, 'Validates correct password', 'Valid password marked invalid');
    
    const invalidValidation = generator.validatePassword('abc', {
        minLength: 8,
        requireUppercase: true
    });
    assert(!invalidValidation.isValid, 'Rejects invalid password', 'Invalid password marked valid');
    assert(invalidValidation.errors.length > 0, 'Provides error messages for invalid password', 'No error messages');
    
    // Test 7: File handler tests
    console.log(colors.yellow('\n💾 FILE HANDLER TESTS\n'));
    const fileHandler = new FileHandler('test-output.txt');
    
    const testPasswords = ['TestPass1!', 'TestPass2@', 'TestPass3#'];
    const saved = fileHandler.savePasswords(testPasswords, {
        length: 10,
        types: 'Mixed',
        timestamp: '2026-03-20'
    });
    assert(saved, 'Saves passwords to file', 'File save failed');
    
    const fileExists = fileHandler.fileExists();
    assert(fileExists, 'File exists after save', 'File not found');
    
    const fileSize = fileHandler.getFileSize();
    assert(fileSize > 0, 'File has content', 'File is empty');
    
    const readPasswords = fileHandler.readPasswords();
    assert(readPasswords.length > 0, 'Reads passwords from file', 'Failed to read passwords');
    
    // Clean up test file
    if (fs.existsSync('test-output.txt')) {
        fs.unlinkSync('test-output.txt');
    }
    if (fs.existsSync('test-output.txt.backup')) {
        fs.unlinkSync('test-output.txt.backup');
    }
    assert(!fs.existsSync('test-output.txt'), 'Cleans up test files', 'Test file not deleted');
    
    // Test 8: Randomness quality (quick check)
    console.log(colors.yellow('\n🎲 RANDOMNESS TESTS\n'));
    const sampleSize = 100;
    const samples = [];
    for (let i = 0; i < sampleSize; i++) {
        samples.push(generator.generatePassword(20, true, true, true, true));
    }
    
    // Check that not all passwords are identical
    const uniquePasswords = new Set(samples);
    assert(uniquePasswords.size > sampleSize * 0.9, 'Generates diverse passwords', 'Passwords lack diversity');
    
    // Check character distribution
    const allChars = samples.join('');
    const hasVariety = /[A-Z]/.test(allChars) && /[a-z]/.test(allChars) && 
                       /[0-9]/.test(allChars) && /[!@#$%^&*]/.test(allChars);
    assert(hasVariety, 'Uses all selected character types', 'Missing some character types');
    
    // Test 9: Statistics tracking
    console.log(colors.yellow('\n📈 STATISTICS TESTS\n'));
    generator.resetStats();
    generator.generatePassword(10, true, true, false, false);
    const stats = generator.getStats();
    assert(stats.totalGenerated === 1, 'Tracks total generated count', 'Count incorrect');
    
    // Test 10: Performance test
    console.log(colors.yellow('\n⚡ PERFORMANCE TEST\n'));
    const startTime = Date.now();
    for (let i = 0; i < 100; i++) {
        generator.generatePassword(16, true, true, true, true);
    }
    const endTime = Date.now();
    const duration = endTime - startTime;
    assert(duration < 1000, `Generates 100 passwords in ${duration}ms (< 1000ms)`, `Too slow: ${duration}ms`);
    
    // Final summary
    console.log(colors.yellow('\n' + '=' .repeat(50)));
    console.log(colors.cyan('\n📊 TEST SUMMARY\n'));
    console.log(`  Total tests: ${testsPassed + testsFailed}`);
    console.log(colors.green(`  Passed: ${testsPassed}`));
    if (testsFailed > 0) {
        console.log(colors.red(`  Failed: ${testsFailed}`));
    } else {
        console.log(colors.green(`\n  🎉 ALL TESTS PASSED! 🎉`));
    }
    console.log(colors.yellow('\n' + '=' .repeat(50) + '\n'));
    
    return testsFailed === 0;
}

// Run the tests
runTests().then(success => {
    process.exit(success ? 0 : 1);
});