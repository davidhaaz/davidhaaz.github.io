    const aliasInput   = document.getElementById('alias');
    const pwInput      = document.getElementById('password');
    const confirmInput = document.getElementById('confirm');
    const submitBtn    = document.getElementById('submit-btn');
    const matchHint    = document.getElementById('match-hint');
    const bars         = [document.getElementById('s1'), document.getElementById('s2'), document.getElementById('s3'), document.getElementById('s4')];

    const strengthColors = ['#e8e6e0', '#e05f3a', '#e0a23a', '#4a8c5c', '#4a8c5c'];

    function scorePassword(pw) {
      let score = 0;
      if (pw.length >= 12 && pw.length <= 14)  score++;
      if (/[A-Z]/.test(pw)) score++;
      if (/[0-9]/.test(pw)) score++;
      if (/[^A-Za-z0-9]/.test(pw)) score++;
      return score;
    }

    function updateStrengthBar(pw) {
      const score = pw.length === 0 ? 0 : scorePassword(pw);
      bars.forEach((bar, i) => {
        bar.style.background = i < score ? strengthColors[score] : '#e8e6e0';
      });
    }

    function updatePasswordRequirements(pw) {
      const alias = aliasInput.value.trim().toLowerCase();
      const pwLower = pw.toLowerCase();

      // Requirement 1: 12-14 characters
      const req1 = pw.length >= 12 && pw.length <= 14;
      const reqLength = document.getElementById('req-length');
      const check1 = reqLength.querySelector('.req-check');

      if (pw.length > 0) {
        if (req1) {
          reqLength.style.color = '#2e7d32'; // green when correct ✓
          check1.style.display = 'inline';
        } else {
          reqLength.style.color = '#c0442b'; // red when incorrect ✗
          check1.style.display = 'none';
        }
      } else {
        reqLength.style.color = '#6b6963'; // default gray
        check1.style.display = 'none';
      }

      // Requirement 2: At least 3 of 4 character types
      const types = [
        /[A-Z]/.test(pw),
        /[a-z]/.test(pw),
        /[0-9]/.test(pw),
        /[^A-Za-z0-9]/.test(pw)
      ];
      const typeCount = types.filter(t => t).length;
      const req2 = typeCount >= 3;
      const reqTypes = document.getElementById('req-types');
      const check2 = reqTypes.querySelector('.req-check');

      const liItems = [
        document.getElementById('req-types-upper'),
        document.getElementById('req-types-lower'),
        document.getElementById('req-types-number'),
        document.getElementById('req-types-special')
      ];

      if (pw.length > 0) {
        if (req2) {
          reqTypes.style.color = '#2e7d32';
          check2.style.display = 'inline';
        } else {
          reqTypes.style.color = '#c0442b';
          check2.style.display = 'none';
        }

        // Only turn up to 3 green, extras stay gray
        let greenCount = 0;
        const allFour = typeCount === 4;

        liItems.forEach((li, i) => {
          if (allFour) {
            li.style.color = '#2e7d32'; // All 4 green
          } 
          else if (types[i] && greenCount < 3) {
            li.style.color = '#2e7d32';
            greenCount++;}
          else if (types[i] && greenCount >= 3) {
            li.style.color = '#6b6963'; // grayed out — already fulfilled
          } 
          else if (!types[i] && req2){
            li.style.color = '#6b6963'; // grayed out — not fulfilled but overall req met
          }
          else {
            li.style.color = '#c0442b'; // red — not yet met
          }
        });

      } else {
        reqTypes.style.color = '#6b6963';
        check2.style.display = 'none';
        liItems.forEach(li => li.style.color = '#6b6963');
      }

      // Requirement 3: Must not include email alias
      const req3 = alias.length === 0 || !pwLower.includes(alias);
      const reqEmail = document.getElementById('req-email');
      const check3 = reqEmail.querySelector('.req-check');

      if (pw.length > 0 && alias.length > 0) {
        if (req3) {
          reqEmail.style.color = '#2e7d32'; // green when correct ✓
          check3.style.display = 'inline';
        } else {
          reqEmail.style.color = '#c0442b'; // red when incorrect ✗
          check3.style.display = 'none';
        }
      } else {
        reqEmail.style.color = '#6b6963'; // default gray
        check3.style.display = 'none';
      }
    }

    function validate() {
      const alias   = aliasInput.value.trim();
      const pw      = pwInput.value;
      const confirm = confirmInput.value;
      const match   = pw === confirm && pw.length > 0;

      if (confirm.length > 0) {
        matchHint.textContent = match ? 'Passwords match' : 'Passwords do not match';
        matchHint.className   = 'match-hint ' + (match ? 'ok' : 'err');
      } else {
        matchHint.textContent = '';
        matchHint.className   = 'match-hint';
      }

      submitBtn.disabled = !(alias && pw.length >= 12 && pw.length <= 14 && match);
    }

    pwInput.addEventListener('input', () => { 
      updateStrengthBar(pwInput.value); 
      updatePasswordRequirements(pwInput.value);
      validate(); 
    });
    confirmInput.addEventListener('input', validate);

    function toggleVisibility(inputId, btn) {
      const input = document.getElementById(inputId);
      const show  = input.type === 'password';
      input.type  = show ? 'text' : 'password';
      const path  = btn.querySelector('path');
      if (show) {
        path.setAttribute('d', 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24');
      } else {
        path.setAttribute('d', 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z');
      }
    }

    const cancelBtn = document.getElementById('cancel-btn');

    function closeCard() {
      const card = document.querySelector('.card');
      card.style.opacity = '0';
      card.style.transform = 'scale(0.97)';
      card.style.transition = 'opacity 0.2s, transform 0.2s';
    }

    document.querySelector('.close-btn').addEventListener('click', closeCard);
    cancelBtn.addEventListener('click', closeCard);

    submitBtn.addEventListener('click', () => {
      const alias = aliasInput.value.trim();
      alert('Account created: ' + alias + '@domain.com');
    });

const ALIAS_RE    = /^[a-zA-Z0-9.\-_]$/;
const ALIAS_STRIP = /[^a-zA-Z0-9.\-_]/g;

aliasInput.addEventListener('keydown', e => {
  const control = ['Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Tab','Home','End'];
  if (!ALIAS_RE.test(e.key) && !control.includes(e.key) && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    aliasInput.style.borderColor = '#c0442b';
    aliasInput.style.boxShadow   = '0 0 0 3px rgba(192,68,43,0.12)';
    setTimeout(() => {
      aliasInput.style.borderColor = '#9b9690';
      aliasInput.style.boxShadow   = '0 0 0 3px rgba(155,150,144,0.12)';
    }, 600);
  }
});

aliasInput.addEventListener('paste', e => {
  e.preventDefault();
  const pasted = (e.clipboardData || window.clipboardData).getData('text');
  const clean  = pasted.replace(ALIAS_STRIP, '');
  const start  = aliasInput.selectionStart;
  const end    = aliasInput.selectionEnd;
  aliasInput.value = aliasInput.value.slice(0, start) + clean + aliasInput.value.slice(end);
  aliasInput.selectionStart = aliasInput.selectionEnd = start + clean.length;
  validate();
});

aliasInput.addEventListener('input', () => {
  aliasInput.value = aliasInput.value.replace(ALIAS_STRIP, '');
  updatePasswordRequirements(pwInput.value);
  validate();
});