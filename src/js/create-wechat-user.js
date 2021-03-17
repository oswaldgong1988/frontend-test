
let contacts = groupBy([...Array(1000).keys()].map(v => createUser()), function (username) {
    let convertToPinyin = Pinyin.convertToPinyin(username.split('').shift());
    return convertToPinyin.split('').shift();
});

var contactsHtml = ``;

for (let userGroupKey in contacts) {
    contactsHtml += `
                <div class="cell cell-group">
                    ${userGroupKey}
                </div>   
    `
    contacts[userGroupKey].map(username => {
        contactsHtml += `
                <div class="cell">
                    <div class="cell__hd">
                        <span class="head-icon" style="background: #${Math.floor(Math.random() * 16777215).toString(16)}"></span>
                    </div>
                    <div class="cell-bd cell-primary">
                        <p>
                            <label class="label">${username}</label>
                        </p>
                        <span class="label-desc"></span>
                    </div>
                    <div class="cell__ft"></div>
                </div>            
            `
    });
}
document.getElementById("js-contact").innerHTML = contactsHtml;

