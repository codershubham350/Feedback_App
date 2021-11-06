const re =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default (emails) => {
  const invalidEmails = emails
    .split(',')
    .map((email) => email.trim())
    .filter((email) => re.test(email) === false);

  // If re(regular expression for emails catches any email which is invalid) exists
  if (invalidEmails.length) {
    return `These emails are invalid: ${invalidEmails} \n*Also please don't put ',' at the end of email`;
  }

  return;
};
