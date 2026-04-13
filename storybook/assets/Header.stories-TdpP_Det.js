import{j as r,M as d,p as f}from"./iframe-v7Qh39PS.js";import{H as g}from"./Header-zUKEyy7d.js";import{t as v}from"./index-C2rRWsJF.js";import{M as y,a as x,b as B}from"./Menu-c0Yk7-R2.js";import{B as w}from"./ButtonIcon-C3c64jj-.js";import{B as b}from"./BUIProvider-Dq073qxq.js";import{B as h}from"./Button-DbFieq7f.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-CvJRoXrp.js";import"./utils-BTRkaVxP.js";import"./useObjectRef-D2k9dnBA.js";import"./Label-dqhcKEKx.js";import"./Hidden-DQKoMRUH.js";import"./useNumberFormatter-CujVYdJO.js";import"./context-DBZ4_gav.js";import"./useFocusable-RTAK5qqG.js";import"./openLink-DhJYPLui.js";import"./useLabel-EzumQXQv.js";import"./useLabels-BlAwLbEW.js";import"./useButton-DoRhoXC9.js";import"./usePress-d5tNe03t.js";import"./textSelection-BeaNrXk5.js";import"./useFocusRing-BTKZdzbY.js";import"./useLink-BnQsptZC.js";import"./Container-Cw7llmQh.js";import"./Link-DdDJsf-i.js";import"./getNodeText-BxA00fNY.js";import"./Text-B4mDMWxC.js";import"./Autocomplete-DCIu0TcL.js";import"./RSPContexts-DguNZy1G.js";import"./useEvent-DftEYdn-.js";import"./SelectionManager-B9ty4xJI.js";import"./SelectionIndicator-BecY6qs8.js";import"./useControlledState-uHAu_Mun.js";import"./useLocalizedStringFormatter-CDTBWl6c.js";import"./Separator-CWjVLqSf.js";import"./Input-BfU2WQIl.js";import"./useFormReset-BVXhgu2X.js";import"./useField-C9kn4VsB.js";import"./Form-DVx58Gd8.js";import"./ListBox-C_lUht65.js";import"./Text-BTRORdui.js";import"./useListState-C6C3NGo2.js";import"./Dialog-CBNZkOrD.js";import"./OverlayArrow-CIIPbG6M.js";import"./animation-bTj1KSLO.js";import"./VisuallyHidden-IWS9gFxu.js";import"./SearchField-D_JUXTWb.js";import"./FieldError-BZSNwmfj.js";import"./Virtualizer-Np8_-FTg.js";import"./linkUtils-tKDL5Jm1.js";import"./useFilter-DWxqpTyu.js";const o=f.meta({title:"Backstage UI/Header",component:g,parameters:{layout:"fullscreen"}}),l=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"},{id:"integrations",label:"Integrations",href:"/integrations"}],j=[{label:"Settings",value:"settings",href:"/settings"},{label:"Invite new members",value:"invite-new-members",href:"/invite-new-members"},{label:"Logout",value:"logout",onClick:()=>{alert("logout")}}],a=e=>r.jsx(d,{initialEntries:["/overview"],children:r.jsx(b,{children:r.jsx(e,{})})}),t=o.story({args:{title:"Page Title"}}),s=o.story({decorators:[a],args:{...t.input.args,tabs:l}}),i=o.story({decorators:[a],render:()=>r.jsx(g,{...t.input.args,customActions:r.jsxs(r.Fragment,{children:[r.jsx(h,{children:"Custom action"}),r.jsxs(y,{children:[r.jsx(w,{variant:"tertiary",icon:r.jsx(v,{}),"aria-label":"More options"}),r.jsx(x,{placement:"bottom end",children:j.map(e=>r.jsx(B,{onAction:e.onClick,href:e.href,children:e.label},e.value))})]})]})})}),n=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"}]}}),m=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"},{label:"Long Breadcrumb Name",href:"/long-breadcrumb"}]}}),c=o.story({decorators:[a],args:{...t.input.args,tabs:l,customActions:r.jsx(h,{children:"Custom action"}),breadcrumbs:[{label:"Home",href:"/"}]}}),I=[{id:"overview",label:"Overview",href:"/overview"},{id:"docs-group",label:"Documentation",items:[{id:"docs",label:"TechDocs",href:"/docs"},{id:"api-docs",label:"API Reference",href:"/api-docs"}]},{id:"ci",label:"CI/CD",href:"/ci"}],p=o.story({decorators:[e=>r.jsx(d,{initialEntries:["/docs"],children:r.jsx(b,{children:r.jsx(e,{})})})],args:{...t.input.args,tabs:I}}),u=o.story({decorators:[a],args:{...t.input.args,tabs:l,activeTabId:"campaigns"}});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    title: 'Page Title'
  }
})`,...t.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    tabs
  }
})`,...s.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <Header {...Default.input.args} customActions={<>
          <Button>Custom action</Button>
          <MenuTrigger>
            <ButtonIcon variant="tertiary" icon={<RiMore2Line />} aria-label="More options" />
            <Menu placement="bottom end">
              {menuItems.map(option => <MenuItem key={option.value} onAction={option.onClick} href={option.href}>
                  {option.label}
                </MenuItem>)}
            </Menu>
          </MenuTrigger>
        </>} />
})`,...i.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    breadcrumbs: [{
      label: 'Home',
      href: '/'
    }]
  }
})`,...n.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    breadcrumbs: [{
      label: 'Home',
      href: '/'
    }, {
      label: 'Long Breadcrumb Name',
      href: '/long-breadcrumb'
    }]
  }
})`,...m.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    tabs,
    customActions: <Button>Custom action</Button>,
    breadcrumbs: [{
      label: 'Home',
      href: '/'
    }]
  }
})`,...c.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [(Story: StoryFn) => <MemoryRouter initialEntries={['/docs']}>
        <BUIProvider>
          <Story />
        </BUIProvider>
      </MemoryRouter>],
  args: {
    ...Default.input.args,
    tabs: groupedTabs
  }
})`,...p.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    tabs,
    activeTabId: 'campaigns'
  }
})`,...u.input.parameters?.docs?.source}}};const jr=["Default","WithTabs","WithCustomActions","WithBreadcrumbs","WithLongBreadcrumbs","WithEverything","WithGroupedTabs","WithExplicitActiveTab"];export{t as Default,n as WithBreadcrumbs,i as WithCustomActions,c as WithEverything,u as WithExplicitActiveTab,p as WithGroupedTabs,m as WithLongBreadcrumbs,s as WithTabs,jr as __namedExportsOrder};
