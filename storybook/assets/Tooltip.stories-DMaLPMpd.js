import{j as e,p as x}from"./iframe-piw0-GWS.js";import{T as c,a as i}from"./Tooltip-B2jaja2e.js";import{B as m}from"./Button-CohSr-fe.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-IkhajRyJ.js";import"./useOverlayTriggerState-CkdldBFn.js";import"./utils-wuzg6Gut.js";import"./useFocusRing-BpapEP6W.js";import"./openLink-BiQlZAwx.js";import"./number-gEdanb4Y.js";import"./I18nProvider-DMoCT0pg.js";import"./useControlledState-WBvh0vQ5.js";import"./animation-BJ7i84cK.js";import"./useHover-CBlM-Gvk.js";import"./Button-Cm250GNY.js";import"./Label-BZuUhWGV.js";import"./Hidden-ChjLH5Dh.js";import"./useLabel-ETY-Wxlf.js";import"./useLabels-BulSWJbq.js";import"./useButton-Cruw1eRB.js";import"./usePress-Bwx27jrs.js";import"./textSelection-eCd97__a.js";import"./index-Co7WXYIc.js";const o=x.meta({title:"Backstage UI/Tooltip",component:c,parameters:{layout:"centered"},argTypes:{isOpen:{control:{type:"boolean"}},isDisabled:{control:{type:"boolean"}},delay:{control:{type:"number"}},closeDelay:{control:{type:"number"}}},render:({children:a,isOpen:r,isDisabled:d,delay:g,closeDelay:y})=>e.jsxs(c,{isOpen:r,isDisabled:d,delay:g,closeDelay:y,children:[e.jsx(m,{children:"Button"}),e.jsx(i,{children:a??"I am a tooltip"})]})}),t=o.story({args:{children:"I am a tooltip"}}),n=o.story({parameters:{layout:"fullscreen"},decorators:[a=>e.jsx("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",backgroundImage:"radial-gradient(circle, var(--bui-border-1) 1px, transparent 1px)",backgroundSize:"16px 16px"},children:e.jsx(a,{})})],args:{...t.input.args,isOpen:!0}}),s=o.story({args:{...t.input.args,isDisabled:!0}}),p=o.story({args:{...t.input.args,delay:0,closeDelay:0}}),l=o.story({parameters:{controls:{exclude:["placement"]}},args:{...t.input.args,isOpen:!0},render:({isOpen:a,children:r})=>e.jsxs(c,{isOpen:a,children:[e.jsx(m,{children:"Button"}),e.jsx(i,{placement:"top",children:r}),e.jsx(i,{placement:"right",children:r}),e.jsx(i,{placement:"bottom",children:r}),e.jsx(i,{placement:"left",children:r})]})}),u=o.story({args:{...t.input.args,isOpen:!0,children:"I am a tooltip with a very long text. orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
