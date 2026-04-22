import{j as r,M as d,p as f}from"./iframe-CC8dZ5v0.js";import{H as g}from"./Header-CAg_SgBG.js";import{t as v}from"./index-D66fjpEe.js";import{M as y,a as x,b as B}from"./Menu-B-bGFjjn.js";import{B as w}from"./ButtonIcon-CKvTHHsj.js";import{B as b}from"./BUIProvider-Dk-mSEjq.js";import{B as h}from"./Button-CJa81rPv.js";import"./preload-helper-PPVm8Dsz.js";import"./useGlobalListeners-VTBRwdE_.js";import"./useObjectRef-DrnumOVC.js";import"./openLink-R4xAzZJL.js";import"./useHover-BJkwObms.js";import"./useLink-DQNVNqqC.js";import"./usePress-CY9pQlxN.js";import"./textSelection-F9xqT_S-.js";import"./Button-Ccij9kQE.js";import"./utils-BJGNU2UD.js";import"./Label-D8RauFTA.js";import"./Hidden-0OxxBXUx.js";import"./useLabel-4Aw-DEns.js";import"./useLabels-Ho-venkv.js";import"./number-DZhvm6eS.js";import"./I18nProvider-CaDEb_MT.js";import"./useButton-DLkEE9sZ.js";import"./Container-qMjyB7zW.js";import"./Link-b82Odtyk.js";import"./useResolvedHref-B0IX69ve.js";import"./getNodeText-B7pGr4qH.js";import"./Text-BoR7DgQk.js";import"./Autocomplete-DI_V9cAQ.js";import"./keyboard-DOMww9i4.js";import"./useEvent-fTcL2C30.js";import"./useLocalizedStringFormatter-DJVXrFCw.js";import"./useControlledState-CSasWubL.js";import"./getItemCount-DOk1B_NP.js";import"./useCollection-D1dXl4eJ.js";import"./FocusScope-GlTV-8Kl.js";import"./Input-Az7S4Dd2.js";import"./ListBox-DlFfrCjD.js";import"./Text-DMMjCAFn.js";import"./useListState-CTDHMg2u.js";import"./Dialog-_Td6pOrN.js";import"./Heading-B-zQOpWR.js";import"./useOverlayTriggerState-umeLxON0.js";import"./VisuallyHidden-BcXz6YOD.js";import"./animation-AqT20z9o.js";import"./SearchField-C7wzWMIR.js";import"./FieldError-B4SxufUN.js";import"./useFormValidation-sG0q17Pr.js";import"./useTextField-ECOxvN2s.js";import"./useField-KVyKcbSv.js";import"./useFormReset-B6UV1Sqp.js";import"./Virtualizer-C5u6rpUt.js";import"./useFilter-DntafXO8.js";const o=f.meta({title:"Backstage UI/Header",component:g,parameters:{layout:"fullscreen"}}),l=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"},{id:"integrations",label:"Integrations",href:"/integrations"}],j=[{label:"Settings",value:"settings",href:"/settings"},{label:"Invite new members",value:"invite-new-members",href:"/invite-new-members"},{label:"Logout",value:"logout",onClick:()=>{alert("logout")}}],a=e=>r.jsx(d,{initialEntries:["/overview"],children:r.jsx(b,{children:r.jsx(e,{})})}),t=o.story({args:{title:"Page Title"}}),s=o.story({decorators:[a],args:{...t.input.args,tabs:l}}),i=o.story({decorators:[a],render:()=>r.jsx(g,{...t.input.args,customActions:r.jsxs(r.Fragment,{children:[r.jsx(h,{children:"Custom action"}),r.jsxs(y,{children:[r.jsx(w,{variant:"tertiary",icon:r.jsx(v,{}),"aria-label":"More options"}),r.jsx(x,{placement:"bottom end",children:j.map(e=>r.jsx(B,{onAction:e.onClick,href:e.href,children:e.label},e.value))})]})]})})}),n=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"}]}}),m=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"},{label:"Long Breadcrumb Name",href:"/long-breadcrumb"}]}}),p=o.story({decorators:[a],args:{...t.input.args,tabs:l,customActions:r.jsx(h,{children:"Custom action"}),breadcrumbs:[{label:"Home",href:"/"}]}}),I=[{id:"overview",label:"Overview",href:"/overview"},{id:"docs-group",label:"Documentation",items:[{id:"docs",label:"TechDocs",href:"/docs"},{id:"api-docs",label:"API Reference",href:"/api-docs"}]},{id:"ci",label:"CI/CD",href:"/ci"}],c=o.story({decorators:[e=>r.jsx(d,{initialEntries:["/docs"],children:r.jsx(b,{children:r.jsx(e,{})})})],args:{...t.input.args,tabs:I}}),u=o.story({decorators:[a],args:{...t.input.args,tabs:l,activeTabId:"campaigns"}});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
