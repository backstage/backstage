import{j as r,M as d,p as f}from"./iframe-D4ojcRBn.js";import{H as g}from"./Header-DaJypzo7.js";import{t as v}from"./index-wUV5n3Lj.js";import{M as y,a as x,b as B}from"./Menu-DUOoFl1B.js";import{B as w}from"./ButtonIcon-CAsWed1t.js";import{B as b}from"./BUIProvider-C7o04JVY.js";import{B as h}from"./Button-BAc8arQo.js";import"./preload-helper-PPVm8Dsz.js";import"./useGlobalListeners-Gjlq1Nm8.js";import"./useObjectRef-DkO8wYK8.js";import"./openLink-Dgpda5ne.js";import"./useHover-BrnPNTQ_.js";import"./useLink-CvJ8GhaC.js";import"./usePress-C2Xo5NR5.js";import"./textSelection-D1kZvdOs.js";import"./Button-DsW7Brbl.js";import"./utils-Cm3b7Skj.js";import"./Label-CB4WGRMe.js";import"./Hidden-DqoOPxZG.js";import"./useLabel-Bpz-kngj.js";import"./useLabels-Bymz_Bk2.js";import"./number-BMwxkJ1f.js";import"./I18nProvider-DcSF5323.js";import"./useButton-Ds76GMuS.js";import"./Container-DQfNqnXi.js";import"./Link-DpoEg7JB.js";import"./useResolvedHref-CTsd7mun.js";import"./getNodeText-C_0vfjfH.js";import"./Text-CQr1Uda4.js";import"./Autocomplete-ZvIpyd9g.js";import"./keyboard-CWbYtSBH.js";import"./useEvent-Bo_Ag7Ze.js";import"./useLocalizedStringFormatter-CxWeQ8ll.js";import"./useControlledState-DLb6xbqZ.js";import"./getItemCount-Bdc0HNtk.js";import"./useCollection-BOJ37AYD.js";import"./FocusScope-CtR-NYVZ.js";import"./Input-B3C67cIY.js";import"./ListBox-UjmNzPiw.js";import"./Text-CeBFKxbr.js";import"./useListState-CLNtscvB.js";import"./Dialog-CJRFIS4q.js";import"./Heading-BNWcgXFS.js";import"./useOverlayTriggerState-KefCD6yL.js";import"./VisuallyHidden-ZFnIyy2e.js";import"./animation-BMMFchtM.js";import"./SearchField-7oyAcyDD.js";import"./FieldError-D1tnYwiC.js";import"./useFormValidation-QY3_JajN.js";import"./useTextField-DuhpfueG.js";import"./useField-DTRRMUNK.js";import"./useFormReset-vk-N9tAs.js";import"./Virtualizer-ChhEdxVf.js";import"./useFilter-DB-RcLD6.js";const o=f.meta({title:"Backstage UI/Header",component:g,parameters:{layout:"fullscreen"}}),l=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"},{id:"integrations",label:"Integrations",href:"/integrations"}],j=[{label:"Settings",value:"settings",href:"/settings"},{label:"Invite new members",value:"invite-new-members",href:"/invite-new-members"},{label:"Logout",value:"logout",onClick:()=>{alert("logout")}}],a=e=>r.jsx(d,{initialEntries:["/overview"],children:r.jsx(b,{children:r.jsx(e,{})})}),t=o.story({args:{title:"Page Title"}}),s=o.story({decorators:[a],args:{...t.input.args,tabs:l}}),i=o.story({decorators:[a],render:()=>r.jsx(g,{...t.input.args,customActions:r.jsxs(r.Fragment,{children:[r.jsx(h,{children:"Custom action"}),r.jsxs(y,{children:[r.jsx(w,{variant:"tertiary",icon:r.jsx(v,{}),"aria-label":"More options"}),r.jsx(x,{placement:"bottom end",children:j.map(e=>r.jsx(B,{onAction:e.onClick,href:e.href,children:e.label},e.value))})]})]})})}),n=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"}]}}),m=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"},{label:"Long Breadcrumb Name",href:"/long-breadcrumb"}]}}),p=o.story({decorators:[a],args:{...t.input.args,tabs:l,customActions:r.jsx(h,{children:"Custom action"}),breadcrumbs:[{label:"Home",href:"/"}]}}),I=[{id:"overview",label:"Overview",href:"/overview"},{id:"docs-group",label:"Documentation",items:[{id:"docs",label:"TechDocs",href:"/docs"},{id:"api-docs",label:"API Reference",href:"/api-docs"}]},{id:"ci",label:"CI/CD",href:"/ci"}],c=o.story({decorators:[e=>r.jsx(d,{initialEntries:["/docs"],children:r.jsx(b,{children:r.jsx(e,{})})})],args:{...t.input.args,tabs:I}}),u=o.story({decorators:[a],args:{...t.input.args,tabs:l,activeTabId:"campaigns"}});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
