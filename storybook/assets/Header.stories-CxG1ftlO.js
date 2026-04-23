import{j as r,M as d,p as f}from"./iframe-izSSIzTR.js";import{H as g}from"./Header-D5AyDIEH.js";import{t as v}from"./index-DGFCpqz_.js";import{M as y,a as x,b as B}from"./Menu-BV3KWA6Z.js";import{B as w}from"./ButtonIcon-BYMJLASR.js";import{B as b}from"./BUIProvider-DHm8fNVT.js";import{B as h}from"./Button-CEAPsvwC.js";import"./preload-helper-PPVm8Dsz.js";import"./useGlobalListeners-CynQJlR4.js";import"./useObjectRef-DA7QflCc.js";import"./openLink-BZ37FDEF.js";import"./useHover-Dn05tM4n.js";import"./useLink-BpjYw728.js";import"./usePress-BYzppgbW.js";import"./textSelection-DP5PjHic.js";import"./Button-CxBdRGKu.js";import"./utils-Cl9gINrl.js";import"./Label-DiQKndYJ.js";import"./Hidden-Z1-_rzje.js";import"./useLabel-C1C1CBQ9.js";import"./useLabels-DlA16iH6.js";import"./number-CfXc65k1.js";import"./I18nProvider-Dt5oCbl9.js";import"./useButton-cd_LBPNR.js";import"./Container-X9hCML4U.js";import"./Link-DbKfI0xJ.js";import"./useResolvedHref-537MV3he.js";import"./getNodeText-D1CWbkC0.js";import"./Text-DdqvwTvZ.js";import"./Autocomplete-CUty0TUf.js";import"./keyboard-PuRhgdyi.js";import"./useEvent-C6O8PQe-.js";import"./useLocalizedStringFormatter-CbcXejhq.js";import"./useControlledState-Bla-K4z3.js";import"./getItemCount-CRf65XBI.js";import"./useCollection-DuuVA1d_.js";import"./FocusScope-C430Nj-p.js";import"./Input-DB8OS-O0.js";import"./ListBox-DB9taT5i.js";import"./Text-B7PTVtbA.js";import"./useListState-DmOJF73R.js";import"./Dialog-0jMX3lLJ.js";import"./Heading-DYvyXDrA.js";import"./useOverlayTriggerState-b9H8BJqN.js";import"./VisuallyHidden-g7Ve-a9e.js";import"./animation-CuZPc9sJ.js";import"./SearchField-C-1h_s6-.js";import"./FieldError-bPDpl4tm.js";import"./useFormValidation-KKy4svAa.js";import"./useTextField-D2DQSV74.js";import"./useField-Ds3mC8xn.js";import"./useFormReset-BRuBz3cs.js";import"./Virtualizer-DdXV22pZ.js";import"./useFilter-HT3pDS3J.js";const o=f.meta({title:"Backstage UI/Header",component:g,parameters:{layout:"fullscreen"}}),l=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"},{id:"integrations",label:"Integrations",href:"/integrations"}],j=[{label:"Settings",value:"settings",href:"/settings"},{label:"Invite new members",value:"invite-new-members",href:"/invite-new-members"},{label:"Logout",value:"logout",onClick:()=>{alert("logout")}}],a=e=>r.jsx(d,{initialEntries:["/overview"],children:r.jsx(b,{children:r.jsx(e,{})})}),t=o.story({args:{title:"Page Title"}}),s=o.story({decorators:[a],args:{...t.input.args,tabs:l}}),i=o.story({decorators:[a],render:()=>r.jsx(g,{...t.input.args,customActions:r.jsxs(r.Fragment,{children:[r.jsx(h,{children:"Custom action"}),r.jsxs(y,{children:[r.jsx(w,{variant:"tertiary",icon:r.jsx(v,{}),"aria-label":"More options"}),r.jsx(x,{placement:"bottom end",children:j.map(e=>r.jsx(B,{onAction:e.onClick,href:e.href,children:e.label},e.value))})]})]})})}),n=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"}]}}),m=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"},{label:"Long Breadcrumb Name",href:"/long-breadcrumb"}]}}),p=o.story({decorators:[a],args:{...t.input.args,tabs:l,customActions:r.jsx(h,{children:"Custom action"}),breadcrumbs:[{label:"Home",href:"/"}]}}),I=[{id:"overview",label:"Overview",href:"/overview"},{id:"docs-group",label:"Documentation",items:[{id:"docs",label:"TechDocs",href:"/docs"},{id:"api-docs",label:"API Reference",href:"/api-docs"}]},{id:"ci",label:"CI/CD",href:"/ci"}],c=o.story({decorators:[e=>r.jsx(d,{initialEntries:["/docs"],children:r.jsx(b,{children:r.jsx(e,{})})})],args:{...t.input.args,tabs:I}}),u=o.story({decorators:[a],args:{...t.input.args,tabs:l,activeTabId:"campaigns"}});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
