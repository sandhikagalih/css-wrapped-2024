const state = {
  changed: null,
  changing: null,
  queue: [],
  count: 0,
};

scroller.addEventListener('scrollsnapchange', (event) => {
  // create the log node
  const message = document.createElement('div');
  message.innerText = 'Changed to ' + event.snapTargetInline.innerText;
  message.style.viewTransitionName = '--message-' + state.count++;
  message.style.viewTransitionClass = 'message';
  snapchange.appendChild(message);

  // manage snap selected state
  state.changed?.classList.remove('change');
  event.snapTargetInline.classList.add('change');
  state.changed = event.snapTargetInline;

  setTimeout(() => {
    state.queue.push({
      parent: snapchange,
      child: message,
    });
  }, 3000);
});

scroller.addEventListener('scrollsnapchanging', (event) => {
  // create the log node
  const message = document.createElement('div');
  message.innerText = 'Changing to ' + event.snapTargetInline.innerText;
  message.style.viewTransitionName = '--message-' + state.count++;
  message.style.viewTransitionClass = 'message';
  snapchanging.appendChild(message);

  // manage snapping state
  state.changed?.classList.remove('change');
  state.changing?.classList.remove('changing');
  event.snapTargetInline.classList.add('changing');
  state.changing = event.snapTargetInline;

  setTimeout(() => {
    state.queue.push({
      parent: snapchanging,
      child: message,
    });
  }, 3000);
});

setInterval(() => {
  if (!state.queue.length) return;

  document?.startViewTransition
    ? document.startViewTransition(() => {
        let node = state.queue.shift();
        node.parent.removeChild(node.child);
      })
    : snapchanging.removeChild(state.queue.shift());
}, 1000);

snapalign.oninput = (event) => {
  document.body.style.setProperty('--_snap-align', event.target.selectedOptions[0].innerText);
};
