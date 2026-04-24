import{j as r,M as d,p as f}from"./iframe-Co8mkF6n.js";import{H as g}from"./Header-VouxaKN0.js";import{t as v}from"./index-D05_zZfE.js";import{M as y,a as x,b as B}from"./Menu-oee8xMbx.js";import{B as w}from"./ButtonIcon-gKiuuoPD.js";import{B as b}from"./BUIProvider-Bea2nV_W.js";import{B as h}from"./Button-CK2yv9g5.js";import"./preload-helper-PPVm8Dsz.js";import"./useGlobalListeners-xgPoTTUI.js";import"./useObjectRef-CKxXIUuU.js";import"./openLink-Dd3JFEWo.js";import"./useHover-Dpk2q5V4.js";import"./useLink-CaVpqdXi.js";import"./usePress-BPCoUohR.js";import"./textSelection-CGMa-xp_.js";import"./Button-BsohaBLi.js";import"./utils-DFVjs8u4.js";import"./Label-DFJY0nKj.js";import"./Hidden-BB_jtIZQ.js";import"./useLabel-CAnYuo-X.js";import"./useLabels-C-5jw__4.js";import"./number-BUCabbiB.js";import"./I18nProvider-CgUstpXg.js";import"./useButton-DEVeMHVy.js";import"./Container-Ccvm6okd.js";import"./Link-ClRkbxxs.js";import"./useResolvedHref-BZJOZptD.js";import"./getNodeText-Sfs-X9AD.js";import"./Text-BqI6Kzhe.js";import"./Autocomplete-2wxhl1YR.js";import"./keyboard-DMpPwGr0.js";import"./useEvent-ChskwOT9.js";import"./useLocalizedStringFormatter-CMC27ohZ.js";import"./useControlledState-CC0_950v.js";import"./getItemCount-a_Apa3M0.js";import"./useCollection-Bv6NTQGn.js";import"./FocusScope-B_BOsWzx.js";import"./Input-BXEMGmmF.js";import"./ListBox-BTsSe9mi.js";import"./Text-CctO4my8.js";import"./useListState-Dr7pMU3r.js";import"./Dialog-Csg5q1nN.js";import"./Heading-CMCpP_gl.js";import"./useOverlayTriggerState-l0gs-tZL.js";import"./VisuallyHidden-BB1faH2D.js";import"./animation-Cpm4eN3T.js";import"./SearchField-Cfd-NsGU.js";import"./FieldError-KgOzCOLr.js";import"./useFormValidation-B_d_Ploj.js";import"./useTextField-DeepGYXq.js";import"./useField-DaoJWrKY.js";import"./useFormReset-BwkCJt7U.js";import"./Virtualizer-D2j8yfFP.js";import"./useFilter-BUtJliKP.js";const o=f.meta({title:"Backstage UI/Header",component:g,parameters:{layout:"fullscreen"}}),l=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"},{id:"integrations",label:"Integrations",href:"/integrations"}],j=[{label:"Settings",value:"settings",href:"/settings"},{label:"Invite new members",value:"invite-new-members",href:"/invite-new-members"},{label:"Logout",value:"logout",onClick:()=>{alert("logout")}}],a=e=>r.jsx(d,{initialEntries:["/overview"],children:r.jsx(b,{children:r.jsx(e,{})})}),t=o.story({args:{title:"Page Title"}}),s=o.story({decorators:[a],args:{...t.input.args,tabs:l}}),i=o.story({decorators:[a],render:()=>r.jsx(g,{...t.input.args,customActions:r.jsxs(r.Fragment,{children:[r.jsx(h,{children:"Custom action"}),r.jsxs(y,{children:[r.jsx(w,{variant:"tertiary",icon:r.jsx(v,{}),"aria-label":"More options"}),r.jsx(x,{placement:"bottom end",children:j.map(e=>r.jsx(B,{onAction:e.onClick,href:e.href,children:e.label},e.value))})]})]})})}),n=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"}]}}),m=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"},{label:"Long Breadcrumb Name",href:"/long-breadcrumb"}]}}),p=o.story({decorators:[a],args:{...t.input.args,tabs:l,customActions:r.jsx(h,{children:"Custom action"}),breadcrumbs:[{label:"Home",href:"/"}]}}),I=[{id:"overview",label:"Overview",href:"/overview"},{id:"docs-group",label:"Documentation",items:[{id:"docs",label:"TechDocs",href:"/docs"},{id:"api-docs",label:"API Reference",href:"/api-docs"}]},{id:"ci",label:"CI/CD",href:"/ci"}],c=o.story({decorators:[e=>r.jsx(d,{initialEntries:["/docs"],children:r.jsx(b,{children:r.jsx(e,{})})})],args:{...t.input.args,tabs:I}}),u=o.story({decorators:[a],args:{...t.input.args,tabs:l,activeTabId:"campaigns"}});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
