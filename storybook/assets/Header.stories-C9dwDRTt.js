import{j as r,M as d,p as f}from"./iframe-V0mCSmm6.js";import{H as g}from"./Header-DtwFvQqm.js";import{t as v}from"./index-B_QuoT2r.js";import{M as y,a as x,b as B}from"./Menu-BlqwpEzm.js";import{B as w}from"./ButtonIcon-CHCJUS0S.js";import{B as b}from"./BUIProvider-D-6HxlFM.js";import{B as h}from"./Button-DL8R4JeD.js";import"./preload-helper-PPVm8Dsz.js";import"./useGlobalListeners-CKMdmYgV.js";import"./useObjectRef-Ds30v8Tp.js";import"./openLink-C69Yx9MB.js";import"./useHover-CFiSx20A.js";import"./useLink-BJETQYI9.js";import"./usePress-CfPKhABG.js";import"./textSelection-UrLfp6UX.js";import"./Button-iv42sllk.js";import"./utils-BDE85oZ4.js";import"./Label-Cr8bMF7C.js";import"./Hidden-CLW6bt9s.js";import"./useLabel-CR4CoWQK.js";import"./useLabels-Bih5Ckwh.js";import"./number-DAvCLclB.js";import"./I18nProvider-mLa6b5wO.js";import"./useButton-Cz5c6zxA.js";import"./Container-DwkLAJar.js";import"./Link-B86kRGwZ.js";import"./getNodeText-CN4JKa7F.js";import"./Text-n94Xqs2F.js";import"./Autocomplete-Csj1k8WT.js";import"./keyboard-DADT6wG6.js";import"./useEvent-EHtBNGAY.js";import"./useLocalizedStringFormatter-C-gNs3QG.js";import"./useControlledState-MEnSdpzT.js";import"./getItemCount-DxOT-chG.js";import"./useCollection-CMnOmfnB.js";import"./FocusScope-Bqg3Wzq4.js";import"./Input-DjPZTvBH.js";import"./ListBox-lJUPLbn3.js";import"./Text-Cn_gwYjP.js";import"./useListState-BR2USGJH.js";import"./Dialog-DAkoVP0H.js";import"./Heading-7rs29LLS.js";import"./useOverlayTriggerState-Ce3GaTDJ.js";import"./VisuallyHidden-BsZWsydh.js";import"./animation-3zA3LL0n.js";import"./SearchField-DlroSFPQ.js";import"./FieldError-dAo41XPK.js";import"./useFormValidation-B26hhFpA.js";import"./useTextField-CFEosqmY.js";import"./useField-DGxVmDro.js";import"./useFormReset-CId3_isl.js";import"./Virtualizer-CoF5iJqn.js";import"./useFilter-CkyI0LjT.js";import"./linkUtils-tKDL5Jm1.js";const o=f.meta({title:"Backstage UI/Header",component:g,parameters:{layout:"fullscreen"}}),l=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"},{id:"integrations",label:"Integrations",href:"/integrations"}],j=[{label:"Settings",value:"settings",href:"/settings"},{label:"Invite new members",value:"invite-new-members",href:"/invite-new-members"},{label:"Logout",value:"logout",onClick:()=>{alert("logout")}}],a=e=>r.jsx(d,{initialEntries:["/overview"],children:r.jsx(b,{children:r.jsx(e,{})})}),t=o.story({args:{title:"Page Title"}}),s=o.story({decorators:[a],args:{...t.input.args,tabs:l}}),i=o.story({decorators:[a],render:()=>r.jsx(g,{...t.input.args,customActions:r.jsxs(r.Fragment,{children:[r.jsx(h,{children:"Custom action"}),r.jsxs(y,{children:[r.jsx(w,{variant:"tertiary",icon:r.jsx(v,{}),"aria-label":"More options"}),r.jsx(x,{placement:"bottom end",children:j.map(e=>r.jsx(B,{onAction:e.onClick,href:e.href,children:e.label},e.value))})]})]})})}),n=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"}]}}),m=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"},{label:"Long Breadcrumb Name",href:"/long-breadcrumb"}]}}),p=o.story({decorators:[a],args:{...t.input.args,tabs:l,customActions:r.jsx(h,{children:"Custom action"}),breadcrumbs:[{label:"Home",href:"/"}]}}),I=[{id:"overview",label:"Overview",href:"/overview"},{id:"docs-group",label:"Documentation",items:[{id:"docs",label:"TechDocs",href:"/docs"},{id:"api-docs",label:"API Reference",href:"/api-docs"}]},{id:"ci",label:"CI/CD",href:"/ci"}],c=o.story({decorators:[e=>r.jsx(d,{initialEntries:["/docs"],children:r.jsx(b,{children:r.jsx(e,{})})})],args:{...t.input.args,tabs:I}}),u=o.story({decorators:[a],args:{...t.input.args,tabs:l,activeTabId:"campaigns"}});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
