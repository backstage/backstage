import{j as r,M as d,p as f}from"./iframe-B7ESvRaB.js";import{H as g}from"./Header-BG2AdC8V.js";import{t as v}from"./index-DbP8Hxod.js";import{M as y,a as x,b as B}from"./Menu-DCUnT5Am.js";import{B as w}from"./ButtonIcon-Be6gXqqZ.js";import{B as b}from"./BUIProvider-sIkzvwhM.js";import{B as h}from"./Button-DwAJKMZz.js";import"./preload-helper-PPVm8Dsz.js";import"./useGlobalListeners-DQLyYZ9f.js";import"./useObjectRef-Dd7TU9CZ.js";import"./openLink-BFNE09ao.js";import"./useHover-ByBQ7Oss.js";import"./useLink-C4zSeWp7.js";import"./usePress-HRSvR9KN.js";import"./textSelection-XuXSjEvl.js";import"./Button-CkPxspJE.js";import"./utils-Cr8yviUJ.js";import"./Label-B06uCzgg.js";import"./Hidden-CK51uwW5.js";import"./useLabel-4lo-IT0x.js";import"./useLabels-CZf5BL8e.js";import"./number-DKEC05wv.js";import"./I18nProvider-BeIWmuaR.js";import"./useButton-DtXFNKA5.js";import"./Container-BF6BZzDy.js";import"./Link-DAVUo9kS.js";import"./getNodeText-C-fdRcD6.js";import"./Text-2w665EoO.js";import"./Autocomplete-CNmEvmEM.js";import"./keyboard-D5YIFYbX.js";import"./useEvent-DHH67uGj.js";import"./useLocalizedStringFormatter-DDwB1B3c.js";import"./useControlledState-CAbD27ky.js";import"./getItemCount-DH8ckQTJ.js";import"./useCollection-BY8iat3j.js";import"./FocusScope-BH80Flu8.js";import"./useTextField-Cr00JWXn.js";import"./useField-BUR4AR8N.js";import"./useFormReset-Cx4bKIVX.js";import"./useFormValidation-b6a5_FZR.js";import"./ListBox-Dy1BN8xK.js";import"./Text-DRd6SIAI.js";import"./useListState-Dp5LXYnH.js";import"./Dialog-B8ZfYxUf.js";import"./Heading-CAK7K7Ei.js";import"./useOverlayTriggerState-BQI29lrc.js";import"./VisuallyHidden-BCbZC_pS.js";import"./animation-Dck7a-0Y.js";import"./SearchField-CNcmfNuo.js";import"./FieldError-eB_pr8Wa.js";import"./Virtualizer-BuzZbCd_.js";import"./useFilter-BTettxGt.js";import"./linkUtils-tKDL5Jm1.js";const o=f.meta({title:"Backstage UI/Header",component:g,parameters:{layout:"fullscreen"}}),l=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"},{id:"integrations",label:"Integrations",href:"/integrations"}],j=[{label:"Settings",value:"settings",href:"/settings"},{label:"Invite new members",value:"invite-new-members",href:"/invite-new-members"},{label:"Logout",value:"logout",onClick:()=>{alert("logout")}}],a=e=>r.jsx(d,{initialEntries:["/overview"],children:r.jsx(b,{children:r.jsx(e,{})})}),t=o.story({args:{title:"Page Title"}}),s=o.story({decorators:[a],args:{...t.input.args,tabs:l}}),i=o.story({decorators:[a],render:()=>r.jsx(g,{...t.input.args,customActions:r.jsxs(r.Fragment,{children:[r.jsx(h,{children:"Custom action"}),r.jsxs(y,{children:[r.jsx(w,{variant:"tertiary",icon:r.jsx(v,{}),"aria-label":"More options"}),r.jsx(x,{placement:"bottom end",children:j.map(e=>r.jsx(B,{onAction:e.onClick,href:e.href,children:e.label},e.value))})]})]})})}),n=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"}]}}),m=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"},{label:"Long Breadcrumb Name",href:"/long-breadcrumb"}]}}),p=o.story({decorators:[a],args:{...t.input.args,tabs:l,customActions:r.jsx(h,{children:"Custom action"}),breadcrumbs:[{label:"Home",href:"/"}]}}),I=[{id:"overview",label:"Overview",href:"/overview"},{id:"docs-group",label:"Documentation",items:[{id:"docs",label:"TechDocs",href:"/docs"},{id:"api-docs",label:"API Reference",href:"/api-docs"}]},{id:"ci",label:"CI/CD",href:"/ci"}],c=o.story({decorators:[e=>r.jsx(d,{initialEntries:["/docs"],children:r.jsx(b,{children:r.jsx(e,{})})})],args:{...t.input.args,tabs:I}}),u=o.story({decorators:[a],args:{...t.input.args,tabs:l,activeTabId:"campaigns"}});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...u.input.parameters?.docs?.source}}};const Ir=["Default","WithTabs","WithCustomActions","WithBreadcrumbs","WithLongBreadcrumbs","WithEverything","WithGroupedTabs","WithExplicitActiveTab"];export{t as Default,n as WithBreadcrumbs,i as WithCustomActions,p as WithEverything,u as WithExplicitActiveTab,c as WithGroupedTabs,m as WithLongBreadcrumbs,s as WithTabs,Ir as __namedExportsOrder};
