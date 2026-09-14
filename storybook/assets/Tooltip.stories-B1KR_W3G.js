import{bQ as e,c5 as x}from"./iframe-J3scbCK7.js";import{a as c,T as i}from"./Tooltip-gmbmHZ4e.js";import{B as m}from"./Button-mRMuG9oL.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-CYiyNzgW.js";import"./useOverlayTriggerState-Djk9kxal.js";import"./utils-CXCc_oGJ.js";import"./useFocusRing-lNGJkQ5U.js";import"./openLink-BYbBBzFI.js";import"./number-B1XZmGQH.js";import"./I18nProvider-BmKrAj2D.js";import"./useControlledState-DShAbZI7.js";import"./animation-CIWnDDLd.js";import"./useHover-CwRlhx06.js";import"./Button-BRjZSFG-.js";import"./Label-CZdg3p-k.js";import"./Hidden-RMOzfft_.js";import"./useLabel-CdAWakw3.js";import"./useLabels-tuukLlho.js";import"./useButton-Dz9TOBMM.js";import"./usePress-oQ0Te5kE.js";import"./textSelection-QyuURRcd.js";import"./index-dtgEZu1w.js";const o=x.meta({title:"Backstage UI/Tooltip",component:c,parameters:{layout:"centered"},argTypes:{isOpen:{control:{type:"boolean"}},isDisabled:{control:{type:"boolean"}},delay:{control:{type:"number"}},closeDelay:{control:{type:"number"}}},render:({children:a,isOpen:r,isDisabled:d,delay:g,closeDelay:y})=>e.jsxs(c,{isOpen:r,isDisabled:d,delay:g,closeDelay:y,children:[e.jsx(m,{children:"Button"}),e.jsx(i,{children:a??"I am a tooltip"})]})}),t=o.story({args:{children:"I am a tooltip"}}),n=o.story({parameters:{layout:"fullscreen"},decorators:[a=>e.jsx("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",backgroundImage:"radial-gradient(circle, var(--bui-border-1) 1px, transparent 1px)",backgroundSize:"16px 16px"},children:e.jsx(a,{})})],args:{...t.input.args,isOpen:!0}}),s=o.story({args:{...t.input.args,isDisabled:!0}}),p=o.story({args:{...t.input.args,delay:0,closeDelay:0}}),l=o.story({parameters:{controls:{exclude:["placement"]}},args:{...t.input.args,isOpen:!0},render:({isOpen:a,children:r})=>e.jsxs(c,{isOpen:a,children:[e.jsx(m,{children:"Button"}),e.jsx(i,{placement:"top",children:r}),e.jsx(i,{placement:"right",children:r}),e.jsx(i,{placement:"bottom",children:r}),e.jsx(i,{placement:"left",children:r})]})}),u=o.story({args:{...t.input.args,isOpen:!0,children:"I am a tooltip with a very long text. orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
