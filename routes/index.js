const express = require('express');

const router = express.Router();

const contacts = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
  { id: 3, name: 'Emily Johnson', email: 'emily.johnson@example.com' },
  { id: 4, name: 'Aarav Patel', email: 'aarav.patel@example.com' },
  { id: 5, name: 'Liu Wei', email: 'liu.wei@example.com' },
  { id: 6, name: 'Fatima Zahra', email: 'fatima.zahra@example.com' },
  { id: 7, name: 'Carlos Hernández', email: 'carlos.hernandez@example.com' },
  { id: 8, name: 'Olivia Kim', email: 'olivia.kim@example.com' },
  { id: 9, name: 'Kwame Nkrumah', email: 'kwame.nkrumah@example.com' },
  { id: 10, name: 'Chen Yu', email: 'chen.yu@example.com' },
];

// GET /contacts
router.get('/contacts', (req, res) => {
  res.render('index', { action: '', contacts, contact: {} });
});

// GET /contacts/new
router.get('/contacts/new', (req, res) => {
  if (req.headers['hx-request']) {
    res.render('form', { contact: {} });
  } else {
    res.render('index', { action: 'new', contacts, contact: {} });
  }
});

// GET /contacts/1
router.get('/contacts/:id', (req, res) => {
  const { id } = req.params;
  const contact = contacts.find((c) => c.id === Number(id));

  if (req.headers['hx-request']) {
    res.render('contact', { contact });
  } else {
    res.render('index', { action: 'show', contacts, contact });
  }
});

// GET /contacts/1/edit
router.get('/contacts/:id/edit', (req, res) => {
  const { id } = req.params;
  const contact = contacts.find((c) => c.id === Number(id));

  if (req.headers['hx-request']) {
    res.render('form', { contact });
  } else {
    res.render('index', { action: 'edit', contacts, contact });
  }
});

// POST /contacts
router.post('/contacts', (req, res) => {
  const newContact = {
    id: contacts.length + 1,
    name: req.body.name,
    email: req.body.email,
  };

  contacts.push(newContact);

  if (req.headers['hx-request']) {
    res.render('sidebar', { contacts }, (err, sidebarHtml) => {
      const html = `
        <main id="content" hx-swap-oob="afterbegin">
          <p class="flash">Contact was successfully added!</p>
        </main>
        ${sidebarHtml}
      `;
      res.send(html);
    });
  } else {
    res.render('index', { action: 'new', contacts, contact: {} });
  }
});

// PUT /contacts/1
router.put('/update/:id', (req, res) => {
  const { id } = req.params;

  const newContact = {
    id: Number(id),
    name: req.body.name,
    email: req.body.email,
  };

  const index = contacts.findIndex((c) => c.id === Number(id));

  if (index !== -1) contacts[index] = newContact;

  if (req.headers['hx-request']) {
    res.render('sidebar', { contacts }, (err, sidebarHtml) => {
      res.render('contact', { contact: contacts[index] }, (err, contactHTML) => {
        const html = `
          ${sidebarHtml}
          <main id="content" hx-swap-oob="true">
            <p class="flash">Contact was successfully updated!</p>
            ${contactHTML}
          </main>
        `;

        res.send(html);
      });
    });
  } else {
    res.redirect(`/contacts/${index + 1}`);
  }
});

// DELETE /contacts/1
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const index = contacts.findIndex((c) => c.id === Number(id));

  if (index !== -1) contacts.splice(index, 1);
  if (req.headers['hx-request']) {
    res.render('sidebar', { contacts }, (err, sidebarHtml) => {
      const html = `
        <main id="content" hx-swap-oob="true">
          <p class="flash">Contact was successfully deleted!</p>
        </main>
        ${sidebarHtml}
      `;
      res.send(html);
    });
  } else {
    res.redirect('/contacts');
  }
});

module.exports = router;
