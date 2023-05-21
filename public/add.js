
document.addEventListener('DOMContentLoaded', function() {
document.getElementById('addBankAccountForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const balance = parseInt(document.getElementById('balance').value);
    if (isNaN(balance)) {
        console.error('Invalid balance value:', balanceInput);
        return;
    }

    const data = {
        name: name,
        balance: balance
    };
  
      fetch('/api/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (response.ok) {
          console.log('Bank account added successfully');
          window.location.href = '/start';
        } else {
          console.error('Failed to add bank account',response.status, response.statusText);
        }
      })
      .catch(error => {
        console.error('Failed to add bank account:',error);
      });
    });
});