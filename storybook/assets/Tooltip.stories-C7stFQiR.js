import{bR as e,c7 as x}from"./iframe-BvJPDVBV.js";import{a as c,T as i}from"./Tooltip-BlSjPfdu.js";import{B as m}from"./Button-6EF7AFv4.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-tDMEiP8o.js";import"./useOverlayTriggerState-Chqi7_FQ.js";import"./utils-Z2mfoDLi.js";import"./useFocusRing-C44Kug38.js";import"./openLink-C9f1t9oF.js";import"./number-CVSPJTca.js";import"./I18nProvider-BN_UnnaB.js";import"./useControlledState-BKLtykmo.js";import"./animation-C2gzKxtB.js";import"./useHover-CdFjvGbq.js";import"./Button-D3GRHLY2.js";import"./Label-Dai2jtKU.js";import"./Hidden-DW6-0oV-.js";import"./useLabel-mJoiZaAP.js";import"./useLabels-DD4p0Oc1.js";import"./useButton-BXsVf132.js";import"./usePress-CthXnzTg.js";import"./textSelection-DZfUw277.js";import"./index-DlBhB-X9.js";const o=x.meta({title:"Backstage UI/Tooltip",component:c,parameters:{layout:"centered"},argTypes:{isOpen:{control:{type:"boolean"}},isDisabled:{control:{type:"boolean"}},delay:{control:{type:"number"}},closeDelay:{control:{type:"number"}}},render:({children:a,isOpen:r,isDisabled:d,delay:g,closeDelay:y})=>e.jsxs(c,{isOpen:r,isDisabled:d,delay:g,closeDelay:y,children:[e.jsx(m,{children:"Button"}),e.jsx(i,{children:a??"I am a tooltip"})]})}),t=o.story({args:{children:"I am a tooltip"}}),n=o.story({parameters:{layout:"fullscreen"},decorators:[a=>e.jsx("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",backgroundImage:"radial-gradient(circle, var(--bui-border-1) 1px, transparent 1px)",backgroundSize:"16px 16px"},children:e.jsx(a,{})})],args:{...t.input.args,isOpen:!0}}),s=o.story({args:{...t.input.args,isDisabled:!0}}),p=o.story({args:{...t.input.args,delay:0,closeDelay:0}}),l=o.story({parameters:{controls:{exclude:["placement"]}},args:{...t.input.args,isOpen:!0},render:({isOpen:a,children:r})=>e.jsxs(c,{isOpen:a,children:[e.jsx(m,{children:"Button"}),e.jsx(i,{placement:"top",children:r}),e.jsx(i,{placement:"right",children:r}),e.jsx(i,{placement:"bottom",children:r}),e.jsx(i,{placement:"left",children:r})]})}),u=o.story({args:{...t.input.args,isOpen:!0,children:"I am a tooltip with a very long text. orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'I am a tooltip'
  }
})`,...t.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [Story => <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: 'radial-gradient(circle, var(--bui-border-1) 1px, transparent 1px)',
    backgroundSize: '16px 16px'
  }}>
        <Story />
      </div>],
  args: {
    ...Default.input.args,
    isOpen: true
  }
})`,...n.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true
  }
})`,...s.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    delay: 0,
    closeDelay: 0
  }
})`,...p.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  parameters: {
    controls: {
      exclude: ['placement']
    }
  },
  args: {
    ...Default.input.args,
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
})`,...l.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isOpen: true,
    children: 'I am a tooltip with a very long text. orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  }
})`,...u.input.parameters?.docs?.source}}};const W=["Default","IsOpen","IsDisabled","NoDelays","OrthogonalPlacements","WithLongText"];export{t as Default,s as IsDisabled,n as IsOpen,p as NoDelays,l as OrthogonalPlacements,u as WithLongText,W as __namedExportsOrder};
