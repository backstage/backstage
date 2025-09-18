import{j as e}from"./iframe-COb0l9Ot.js";import{T as c,a as o}from"./Tooltip-BmnSCv81.js";import{B as m}from"./Button-DAX9ip5E.js";import"./preload-helper-D9Z9MdNV.js";import"./OverlayArrow-DMoaJYzN.js";import"./utils-IJnPAz4s.js";import"./clsx-B-dksMZM.js";import"./useFocusRing-CK8Hb1fV.js";import"./context-Df5neAtJ.js";import"./useControlledState-BDO7WKAg.js";import"./useStyles-DOBMQz9q.js";import"./Button-BcPV0BZn.js";import"./Hidden-Bq0KHOWX.js";import"./usePress-DxK7RDE7.js";const U={title:"Backstage UI/Tooltip",component:c,parameters:{layout:"centered"},argTypes:{isOpen:{control:{type:"boolean"}},isDisabled:{control:{type:"boolean"}},placement:{options:["top","right","bottom","left"],control:{type:"inline-radio"}},delay:{control:{type:"number"}},closeDelay:{control:{type:"number"}}},render:({children:p,isOpen:r,isDisabled:u,placement:d,delay:g,closeDelay:x})=>e.jsxs(c,{isOpen:r,isDisabled:u,delay:g,closeDelay:x,children:[e.jsx(m,{children:"Button"}),e.jsx(o,{placement:d,children:p??"I am a tooltip"})]})},t={args:{children:"I am a tooltip"}},a={args:{...t.args,isOpen:!0}},s={args:{...t.args,isDisabled:!0}},i={args:{...t.args,delay:0,closeDelay:0}},n={parameters:{controls:{exclude:["placement"]}},args:{...t.args,isOpen:!0},render:({isOpen:p,children:r})=>e.jsxs(c,{isOpen:p,children:[e.jsx(m,{children:"Button"}),e.jsx(o,{placement:"top",children:r}),e.jsx(o,{placement:"right",children:r}),e.jsx(o,{placement:"bottom",children:r}),e.jsx(o,{placement:"left",children:r})]})},l={args:{...t.args,isOpen:!0,children:"I am a tooltip with a very long text. orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'I am a tooltip'
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    isOpen: true
  }
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    isDisabled: true
  }
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    delay: 0,
    closeDelay: 0
  }
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      exclude: ['placement']
    }
  },
  args: {
    ...Default.args,
    isOpen: true
  },
  render: ({
    isOpen,
    children
  }) => {
    return <TooltipTrigger isOpen={isOpen}>
        <Button>Button</Button>
        <Tooltip placement="top">{children}</Tooltip>
        <Tooltip placement="right">{children}</Tooltip>
        <Tooltip placement="bottom">{children}</Tooltip>
        <Tooltip placement="left">{children}</Tooltip>
      </TooltipTrigger>;
  }
}`,...n.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    isOpen: true,
    children: 'I am a tooltip with a very long text. orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  }
}`,...l.parameters?.docs?.source}}};const w=["Default","IsOpen","IsDisabled","NoDelays","OrthogonalPlacements","WithLongText"];export{t as Default,s as IsDisabled,a as IsOpen,i as NoDelays,n as OrthogonalPlacements,l as WithLongText,w as __namedExportsOrder,U as default};
