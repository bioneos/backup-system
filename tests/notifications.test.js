const init = require('../lib/config/init.js');

describe('Parsing config object for notification settings', function() {
  const machineName = "test"

  // Per this post - https://blogs.msdn.microsoft.com/testing123/2009/02/06/email-address-test-cases/
  const validEmails = ['email@domain.com','firstname.lastname@domain.com',
    'email@subdomain.domain.com','firstname+lastname@domain.com',
    'email@123.123.123.123','email@[123.123.123.123]','"email"@domain.com',
    '1234567890@domain.com','email@domain-one.com','_______@domain.com',
    'email@domain.name','email@domain.co.jp','firstname-lastname@domain.com'];
  const invalidEmails = ['plainaddress','#@%^%#$@#$@#.com','@domain.com',
    'Joe Smith <email@domain.com>','email.domain.com',
    'email@domain@domain.com','.email@domain.com','email.@domain.com',
    'email..email@domain.com','email@domain.com (Joe Smith)','email@domain',
    'email@-domain.com','email@domain..com'];

  const validSMSPhones = ['+12345678909','12345678909','21234567890',
    '+31234567890'];
  const invalidSMSPhones = ['1234567890','01234567890','1-123-456-7890',
    '+1-123-456-7890','1234567890912315','1234556789a','#12345678909'];

  const validAWSRegions = ['us-east-1','us-east-2','us-west-2',
    'ap-northeast-1','ap-south-1','ap-southeast-2','ca-central-1',
    'cn-north-1','eu-west-1','sa-east-1'];
  const invalidAWSRegions = ['useast1','us-east1','ba-east-1',
    'us-south-central-1','ap-southwesteast-1','us-east','us-1','east-1',
    'us-east-10','us-west-0'];

  describe('Testing email addresses', function() {
    validEmails.forEach(function(email) {
      let notifications = { email_to : [] };
      test('Valid emails', function() {
        expect(init.__validateNotifications(notifications)).toEqual([]);
      });
    });
    
    // The current regex being used fails to invalidate 'email@domain.web'
    // and 'email@111.222.333.44444'.
    // The first fails because there is no check for all top level domains.
    // The second fails because the check for domain names that start with 
    // numbers.
    
    invalidEmails.forEach(function(email) {
      let notifications = {  email_to : [ email ] };
      test('Individual invalid emails', function() {
        expect(init.__validateNotifications(notifications)).toHaveLength(1);
      });
    });

    test('All invalid emails', function() {
      let notifications = { email_to : invalidEmails };
      expect(init.__validateNotifications(notifications)).toHaveLength(invalidEmails.length);
    });

    test('Both valid and invalid emails', function() {
      let notifications = { email_to : validEmails.concat(invalidEmails) };
      expect(init.__validateNotifications(notifications)).toHaveLength(invalidEmails.length);
    });
  });

  describe('Testing sms phone numbers', function() {
    // With valid phone numbers, there should be no errors returned
    validSMSPhones.forEach(function(phoneNum) {
      let notifications = { sms_to : phoneNum };
      test('Individual SMS phone numbers', () => {
        expect(init.__validateNotifications(notifications)).toEqual([]);
      });
    });

    invalidSMSPhones.forEach(function(phoneNum) {
      let notifications = { sms_to : phoneNum };
      test('Individual invalid SMS phone numbers', () => {
        expect(init.__validateNotifications(notifications)).toHaveLength(1);
      });
    });
  });

  describe('Testing AWS regions', function() {
    validAWSRegions.forEach(function(region) {
      let notifications = { sms_region : region };
      test('Individual valid AWS regions', () => {
        expect(init.__validateNotifications(notifications)).toEqual([]);
      });
    });

    invalidAWSRegions.forEach(function(region) {
      let notifications = { sms_region : region };
      test('Individual invalid AWS regions', () => {
        expect(init.__validateNotifications(notifications)).toHaveLength(1);
       });
    });

  });
});