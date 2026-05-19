import{j as e,p as x}from"./iframe-BCuiGO18.js";import{T as c,a as i}from"./Tooltip-BgBKjgNH.js";import{B as m}from"./Button-B4T76T1U.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-4ckOICrI.js";import"./useOverlayTriggerState-FMs9pAOe.js";import"./utils-Dk-My0Vp.js";import"./useFocusRing-DLmUbRy9.js";import"./openLink-qumaaci0.js";import"./number-K2-BhP7Z.js";import"./I18nProvider-PVYTewA5.js";import"./useControlledState-BCKq2N8L.js";import"./animation-G_BOhArD.js";import"./useHover-DAnXmX41.js";import"./Button-D45nAvky.js";import"./Label-CP3Gf_jA.js";import"./Hidden-CQxh535z.js";import"./useLabel-Cghjfl30.js";import"./useLabels-DNIhmQLC.js";import"./useButton-wJ1TOWtu.js";import"./usePress-BvVw0-yf.js";import"./textSelection-B2Nn6fLe.js";import"./index-CZoZdV61.js";const o=x.meta({title:"Backstage UI/Tooltip",component:c,parameters:{layout:"centered"},argTypes:{isOpen:{control:{type:"boolean"}},isDisabled:{control:{type:"boolean"}},delay:{control:{type:"number"}},closeDelay:{control:{type:"number"}}},render:({children:a,isOpen:r,isDisabled:d,delay:g,closeDelay:y})=>e.jsxs(c,{isOpen:r,isDisabled:d,delay:g,closeDelay:y,children:[e.jsx(m,{children:"Button"}),e.jsx(i,{children:a??"I am a tooltip"})]})}),t=o.story({args:{children:"I am a tooltip"}}),n=o.story({parameters:{layout:"fullscreen"},decorators:[a=>e.jsx("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",backgroundImage:"radial-gradient(circle, var(--bui-border-1) 1px, transparent 1px)",backgroundSize:"16px 16px"},children:e.jsx(a,{})})],args:{...t.input.args,isOpen:!0}}),s=o.story({args:{...t.input.args,isDisabled:!0}}),p=o.story({args:{...t.input.args,delay:0,closeDelay:0}}),l=o.story({parameters:{controls:{exclude:["placement"]}},args:{...t.input.args,isOpen:!0},render:({isOpen:a,children:r})=>e.jsxs(c,{isOpen:a,children:[e.jsx(m,{children:"Button"}),e.jsx(i,{placement:"top",children:r}),e.jsx(i,{placement:"right",children:r}),e.jsx(i,{placement:"bottom",children:r}),e.jsx(i,{placement:"left",children:r})]})}),u=o.story({args:{...t.input.args,isOpen:!0,children:"I am a tooltip with a very long text. orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...u.input.parameters?.docs?.source}}};const _=["Default","IsOpen","IsDisabled","NoDelays","OrthogonalPlacements","WithLongText"];export{t as Default,s as IsDisabled,n as IsOpen,p as NoDelays,l as OrthogonalPlacements,u as WithLongText,_ as __namedExportsOrder};
