import{j as r,M as d,p as f}from"./iframe-Cz6SWQVH.js";import{H as g}from"./Header-C9uwMHwN.js";import{t as v}from"./index-B8gNhpoB.js";import{M as y,a as x,b as B}from"./Menu-ijCPdQDI.js";import{B as w}from"./ButtonIcon-BXF_n26-.js";import{B as b}from"./BUIProvider-C-bV_KZY.js";import{B as h}from"./Button-nKh3c4M0.js";import"./preload-helper-PPVm8Dsz.js";import"./useGlobalListeners-_pWc5lzW.js";import"./useObjectRef-B1XDxt8o.js";import"./openLink-yrE7vS55.js";import"./useHover-LSx6rYV4.js";import"./useLink-DCpBATML.js";import"./usePress-BeBtVFaO.js";import"./textSelection-CYg68ItS.js";import"./Button-DG_lt24t.js";import"./utils-DdYDv1my.js";import"./Label-ZZaSZ0gq.js";import"./Hidden-DyqXWYJG.js";import"./useLabel-C4-PSEwD.js";import"./useLabels-CCt0vcrF.js";import"./number-UJKiLYay.js";import"./I18nProvider-ChnkasvC.js";import"./useButton-rOnnSkgn.js";import"./Container-CTpegvtF.js";import"./Link-DnGcHR1d.js";import"./getNodeText-8mXZv5Ta.js";import"./Text-tYPEUn0s.js";import"./Autocomplete-8q4gaT1h.js";import"./keyboard-DV3FDKrT.js";import"./useEvent-Clq4kWZo.js";import"./useLocalizedStringFormatter-BUNlf1KX.js";import"./useControlledState-DIn6soyg.js";import"./getItemCount-BLULPfOg.js";import"./useCollection-CLMIp0SM.js";import"./FocusScope-BV-ICilT.js";import"./useTextField-C49JtK49.js";import"./useField-CoFUr6lr.js";import"./useFormReset-B0RXVB7U.js";import"./useFormValidation-D_7zkheX.js";import"./ListBox-BOJ6oMAq.js";import"./Text-BGEAm46S.js";import"./useListState-ryLfoNuF.js";import"./Dialog-DKcVkm3s.js";import"./Heading-oZV7ajQ9.js";import"./useOverlayTriggerState-B5OTrc4C.js";import"./VisuallyHidden-BXPZyn_f.js";import"./animation-BcNqkzOv.js";import"./SearchField-ksHvgZAe.js";import"./FieldError-Cc3YzjP5.js";import"./Virtualizer-B08Jx9ij.js";import"./useFilter-4KlvbgY_.js";import"./linkUtils-tKDL5Jm1.js";const o=f.meta({title:"Backstage UI/Header",component:g,parameters:{layout:"fullscreen"}}),l=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"},{id:"integrations",label:"Integrations",href:"/integrations"}],j=[{label:"Settings",value:"settings",href:"/settings"},{label:"Invite new members",value:"invite-new-members",href:"/invite-new-members"},{label:"Logout",value:"logout",onClick:()=>{alert("logout")}}],a=e=>r.jsx(d,{initialEntries:["/overview"],children:r.jsx(b,{children:r.jsx(e,{})})}),t=o.story({args:{title:"Page Title"}}),s=o.story({decorators:[a],args:{...t.input.args,tabs:l}}),i=o.story({decorators:[a],render:()=>r.jsx(g,{...t.input.args,customActions:r.jsxs(r.Fragment,{children:[r.jsx(h,{children:"Custom action"}),r.jsxs(y,{children:[r.jsx(w,{variant:"tertiary",icon:r.jsx(v,{}),"aria-label":"More options"}),r.jsx(x,{placement:"bottom end",children:j.map(e=>r.jsx(B,{onAction:e.onClick,href:e.href,children:e.label},e.value))})]})]})})}),n=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"}]}}),m=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"},{label:"Long Breadcrumb Name",href:"/long-breadcrumb"}]}}),p=o.story({decorators:[a],args:{...t.input.args,tabs:l,customActions:r.jsx(h,{children:"Custom action"}),breadcrumbs:[{label:"Home",href:"/"}]}}),I=[{id:"overview",label:"Overview",href:"/overview"},{id:"docs-group",label:"Documentation",items:[{id:"docs",label:"TechDocs",href:"/docs"},{id:"api-docs",label:"API Reference",href:"/api-docs"}]},{id:"ci",label:"CI/CD",href:"/ci"}],c=o.story({decorators:[e=>r.jsx(d,{initialEntries:["/docs"],children:r.jsx(b,{children:r.jsx(e,{})})})],args:{...t.input.args,tabs:I}}),u=o.story({decorators:[a],args:{...t.input.args,tabs:l,activeTabId:"campaigns"}});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
