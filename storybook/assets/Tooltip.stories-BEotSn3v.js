import{j as e}from"./jsx-runtime-hv06LKfz.js";import{T as c,a as r}from"./Tooltip-C-phT2Wk.js";import{B as m}from"./Button-DuK7rGK8.js";import"./index-D8-PC79C.js";import"./OverlayArrow-DE7RRCpW.js";import"./utils-SVxEJA3c.js";import"./clsx-B-dksMZM.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./useFocusRing-CSBfGNH9.js";import"./context-C8UuisDZ.js";import"./useControlledState-hFzvQclK.js";import"./useStyles-Dc-DqJ_c.js";import"./Button-U0_f04OL.js";import"./Hidden-Bl3CD3Sw.js";import"./usePress-BiO5y4q0.js";const L={title:"Backstage UI/Tooltip",component:c,parameters:{layout:"centered"},argTypes:{isOpen:{control:{type:"boolean"}},isDisabled:{control:{type:"boolean"}},placement:{options:["top","right","bottom","left"],control:{type:"inline-radio"}},delay:{control:{type:"number"}},closeDelay:{control:{type:"number"}}},render:({tooltip:p,isOpen:o,isDisabled:u,placement:d,delay:g,closeDelay:x})=>e.jsxs(c,{isOpen:o,isDisabled:u,delay:g,closeDelay:x,children:[e.jsx(m,{children:"Button"}),e.jsx(r,{placement:d,children:p??"I am a tooltip"})]})},t={args:{tooltip:"I am a tooltip"}},a={args:{...t.args,isOpen:!0}},i={args:{...t.args,isDisabled:!0}},s={args:{...t.args,delay:0,closeDelay:0}},n={parameters:{controls:{exclude:["placement"]}},args:{...t.args,isOpen:!0},render:({isOpen:p,tooltip:o})=>e.jsxs(c,{isOpen:p,children:[e.jsx(m,{children:"Button"}),e.jsx(r,{placement:"top",children:o}),e.jsx(r,{placement:"right",children:o}),e.jsx(r,{placement:"bottom",children:o}),e.jsx(r,{placement:"left",children:o})]})},l={args:{...t.args,isOpen:!0,tooltip:"I am a tooltip with a very long text. orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    tooltip: 'I am a tooltip'
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    isOpen: true
  }
}`,...a.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    isDisabled: true
  }
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    delay: 0,
    closeDelay: 0
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
    tooltip
  }) => {
    return <TooltipTrigger isOpen={isOpen}>
        <Button>Button</Button>
        <Tooltip placement="top">{tooltip}</Tooltip>
        <Tooltip placement="right">{tooltip}</Tooltip>
        <Tooltip placement="bottom">{tooltip}</Tooltip>
        <Tooltip placement="left">{tooltip}</Tooltip>
      </TooltipTrigger>;
  }
}`,...n.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    isOpen: true,
    tooltip: 'I am a tooltip with a very long text. orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  }
}`,...l.parameters?.docs?.source}}};const N=["Default","IsOpen","IsDisabled","NoDelays","OrthogonalPlacements","WithLongText"];export{t as Default,i as IsDisabled,a as IsOpen,s as NoDelays,n as OrthogonalPlacements,l as WithLongText,N as __namedExportsOrder,L as default};
