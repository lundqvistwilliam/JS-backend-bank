fetch('/api/account')
  .then(response => response.json())
  .then(data => {
    displayBankAccounts(data.bankAccounts);
  })
  .catch(error => {
    console.error('Failed to retrieve bank accounts:', error);
});

function displayBankAccounts(accounts) {
    const bankAccountsList = document.getElementById('bankAccountsList');
    bankAccountsList.innerHTML = '';

    accounts.forEach(account => {
        const accountElement = document.createElement('div');
        accountElement.innerHTML = `
            <b>ID</b>: ${account._id}<br>
            <b>Name</b>: ${account.name}<br>
            <b>Balance</b>: $${account.balance}<br>
            <br>
            <input type="number" id="withdrawInput_${account._id}" placeholder="- Withdraw amount">
            <button onclick="withdraw('${account._id}')" class="action-button">Withdraw</button><br>
            <input type="number" id="depositInput_${account._id}" placeholder="+ Deposit amount ">
            <button onclick="deposit('${account._id}')" class="action-button">Deposit</button><br><br><br>
            <div id="button-container">
            <div id="remove-container">
            <button id="removeBtn" onclick="removeAccount('${account._id}')">Remove account</button>
            </div>
            `;
        accountElement.classList.add('account-item');
        bankAccountsList.appendChild(accountElement);
    });
}


function withdraw(accountId){
    const withdrawAmount = parseFloat(document.getElementById(`withdrawInput_${accountId}`).value);

    if (!withdrawAmount) {
        return;
      }

    fetch(`/api/withdraw/${accountId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: withdrawAmount })
    })
    .then(response => {
        if (response.ok) {
            console.log('Withdraw successful');
        } else {
            console.error('Failed to withdraw');
        }
    })
    .then(data => {
        location.reload();
    })
    .catch(error => {
        console.error('Failed to withdraw:', error);
    });
}

function deposit(accountId){
    const depositAmount = parseFloat(document.getElementById(`depositInput_${accountId}`).value);

    if (!depositAmount) {
        console.log('No withdrawal amount specified');
        return;
      }

    fetch(`/api/deposit/${accountId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: depositAmount })
    })
    .then(response => {
        if (response.ok) {
            console.log('Deposit successful');
        } else {
            console.error('Failed to deposit');
        }
    })
    .then(data => {
        location.reload();
    })
    .catch(error => {
        console.error('Failed to deposit:', error);
    });
};

function removeAccount(accountId) {
    fetch(`/api/remove/${accountId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          console.log('Account removed successfully');
          location.reload();
        } else {
          console.error('Failed to remove account');
        }
      })
      .catch(error => {
        console.error('Failed to remove account:', error);
      });
}

