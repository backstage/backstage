import{j as r,M as d,p as f}from"./iframe-C8vBbMI-.js";import{H as g}from"./Header-CdYab26x.js";import{t as v}from"./index-DPsgZtqe.js";import{M as y,a as x,b as B}from"./Menu-g7SgQDD3.js";import{B as w}from"./ButtonIcon-BjLp1jla.js";import{B as b}from"./BUIProvider-CEL4NntB.js";import{B as h}from"./Button-DHQksLcH.js";import"./preload-helper-PPVm8Dsz.js";import"./useGlobalListeners-B1a-_PtV.js";import"./useObjectRef-w7SDPJ-k.js";import"./openLink-B9VHRTOW.js";import"./useHover-bFr0yBE9.js";import"./useLink-WnIuR_q2.js";import"./usePress-DrjxzLT9.js";import"./textSelection-CVxSjLs7.js";import"./Button-CPFg2ZRO.js";import"./utils-CerafOdN.js";import"./Label-pU9V9ZQL.js";import"./Hidden-Y5KeQSje.js";import"./useLabel-DCpQaTw3.js";import"./useLabels-D7tYLmjR.js";import"./number-xD8XybAE.js";import"./I18nProvider--oqaU1ds.js";import"./useButton-BaBWm-gL.js";import"./Container-DJFZbQ4m.js";import"./Link-wlzG-EhX.js";import"./useResolvedHref-cJdDhzhd.js";import"./getNodeText-BwVtOjwm.js";import"./Text-BeJ1OsP5.js";import"./Autocomplete-Dacd6GYy.js";import"./keyboard-Db6GjkWt.js";import"./useEvent-DLU3L-Lt.js";import"./useLocalizedStringFormatter-78qOGr4H.js";import"./useControlledState-KXKKTKqf.js";import"./getItemCount-_WgL2LTp.js";import"./useCollection-B7ApLeCC.js";import"./FocusScope-DjCBGgFa.js";import"./Input-D0vDUCch.js";import"./ListBox-DRopI3bb.js";import"./Text-BkGpp61l.js";import"./useListState-bUi_r9ol.js";import"./Dialog-9CEfQkon.js";import"./Heading-BYVKxxG-.js";import"./useOverlayTriggerState-D3Y-GW09.js";import"./VisuallyHidden-C7edqotG.js";import"./animation-CRPU3zwe.js";import"./SearchField-rvQLyu7r.js";import"./FieldError-CkIyJwZd.js";import"./useFormValidation-BYEWQaHx.js";import"./useTextField-aXFfJKAl.js";import"./useField-B3g5PPj7.js";import"./useFormReset-Z4CMgK74.js";import"./Virtualizer-C6PpgEsq.js";import"./useFilter-DZjhdSPx.js";const o=f.meta({title:"Backstage UI/Header",component:g,parameters:{layout:"fullscreen"}}),l=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"},{id:"integrations",label:"Integrations",href:"/integrations"}],j=[{label:"Settings",value:"settings",href:"/settings"},{label:"Invite new members",value:"invite-new-members",href:"/invite-new-members"},{label:"Logout",value:"logout",onClick:()=>{alert("logout")}}],a=e=>r.jsx(d,{initialEntries:["/overview"],children:r.jsx(b,{children:r.jsx(e,{})})}),t=o.story({args:{title:"Page Title"}}),s=o.story({decorators:[a],args:{...t.input.args,tabs:l}}),i=o.story({decorators:[a],render:()=>r.jsx(g,{...t.input.args,customActions:r.jsxs(r.Fragment,{children:[r.jsx(h,{children:"Custom action"}),r.jsxs(y,{children:[r.jsx(w,{variant:"tertiary",icon:r.jsx(v,{}),"aria-label":"More options"}),r.jsx(x,{placement:"bottom end",children:j.map(e=>r.jsx(B,{onAction:e.onClick,href:e.href,children:e.label},e.value))})]})]})})}),n=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"}]}}),m=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"},{label:"Long Breadcrumb Name",href:"/long-breadcrumb"}]}}),p=o.story({decorators:[a],args:{...t.input.args,tabs:l,customActions:r.jsx(h,{children:"Custom action"}),breadcrumbs:[{label:"Home",href:"/"}]}}),I=[{id:"overview",label:"Overview",href:"/overview"},{id:"docs-group",label:"Documentation",items:[{id:"docs",label:"TechDocs",href:"/docs"},{id:"api-docs",label:"API Reference",href:"/api-docs"}]},{id:"ci",label:"CI/CD",href:"/ci"}],c=o.story({decorators:[e=>r.jsx(d,{initialEntries:["/docs"],children:r.jsx(b,{children:r.jsx(e,{})})})],args:{...t.input.args,tabs:I}}),u=o.story({decorators:[a],args:{...t.input.args,tabs:l,activeTabId:"campaigns"}});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...m.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...p.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [(Story: StoryFn) => <MemoryRouter initialEntries={['/docs']}>
        <BUIProvider>
          <Story />
        </BUIProvider>
      </MemoryRouter>],
  args: {
    ...Default.input.args,
    tabs: groupedTabs
  }
})`,...c.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    tabs,
    activeTabId: 'campaigns'
  }
})`,...u.input.parameters?.docs?.source}}};const Mr=["Default","WithTabs","WithCustomActions","WithBreadcrumbs","WithLongBreadcrumbs","WithEverything","WithGroupedTabs","WithExplicitActiveTab"];export{t as Default,n as WithBreadcrumbs,i as WithCustomActions,p as WithEverything,u as WithExplicitActiveTab,c as WithGroupedTabs,m as WithLongBreadcrumbs,s as WithTabs,Mr as __namedExportsOrder};
