import{j as r,M as d,p as f}from"./iframe-Pg_F-I9L.js";import{H as g}from"./Header-CWRFW506.js";import{t as v}from"./index-CSrWawO4.js";import{M as y,a as x,b as B}from"./Menu-BFwyRi74.js";import{B as w}from"./ButtonIcon-CuekJ3ce.js";import{B as b}from"./BUIProvider-Bui5puU7.js";import{B as h}from"./Button-BGVUloxV.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-D4FhjViO.js";import"./utils-qMO_rWJq.js";import"./useObjectRef-HykmMk-o.js";import"./Label-3zKuDuDQ.js";import"./Hidden-Ys7ZlpFD.js";import"./useNumberFormatter-Cuizy-2S.js";import"./context-DiEr_iNn.js";import"./useFocusable-tELC1w7o.js";import"./openLink-CHCvyqBl.js";import"./useLabel-Cv3Ke033.js";import"./useLabels-CfZuGdDh.js";import"./useButton-Cd7mVcz4.js";import"./usePress-D9RcbHE0.js";import"./textSelection-p-bbU3FQ.js";import"./useFocusRing-CTLDmw4r.js";import"./useLink-BJHUMWSy.js";import"./Container-CQf5jhLx.js";import"./Link-BbYbeRx7.js";import"./getNodeText-D8ndoH4Y.js";import"./Text-DGtaFSAT.js";import"./Autocomplete-X6susHtK.js";import"./RSPContexts-CP7vpgdH.js";import"./useEvent-Ie90aWnc.js";import"./SelectionManager-wVy5pdP7.js";import"./SelectionIndicator-BsjX55GR.js";import"./useControlledState-CJUYhagC.js";import"./useLocalizedStringFormatter-s8xubs7w.js";import"./Separator-2guFG7g-.js";import"./Input-q6KMR1kV.js";import"./useFormReset-pX1J00j9.js";import"./useField-Bk4bOBfV.js";import"./Form-CeMUfUJs.js";import"./ListBox-BJbTwm_8.js";import"./Text-llDYcWgc.js";import"./useListState-Csz_vsZA.js";import"./Dialog-D2iow-a9.js";import"./OverlayArrow-BVZSlvOl.js";import"./animation-yYjl9c-H.js";import"./VisuallyHidden-Lu2_ql2A.js";import"./SearchField-WKyxM0ma.js";import"./FieldError-Ci19Uhdz.js";import"./Virtualizer-DrcyNu88.js";import"./linkUtils-tKDL5Jm1.js";import"./useFilter-UDt6kk6K.js";const o=f.meta({title:"Backstage UI/Header",component:g,parameters:{layout:"fullscreen"}}),l=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"},{id:"integrations",label:"Integrations",href:"/integrations"}],j=[{label:"Settings",value:"settings",href:"/settings"},{label:"Invite new members",value:"invite-new-members",href:"/invite-new-members"},{label:"Logout",value:"logout",onClick:()=>{alert("logout")}}],a=e=>r.jsx(d,{initialEntries:["/overview"],children:r.jsx(b,{children:r.jsx(e,{})})}),t=o.story({args:{title:"Page Title"}}),s=o.story({decorators:[a],args:{...t.input.args,tabs:l}}),i=o.story({decorators:[a],render:()=>r.jsx(g,{...t.input.args,customActions:r.jsxs(r.Fragment,{children:[r.jsx(h,{children:"Custom action"}),r.jsxs(y,{children:[r.jsx(w,{variant:"tertiary",icon:r.jsx(v,{}),"aria-label":"More options"}),r.jsx(x,{placement:"bottom end",children:j.map(e=>r.jsx(B,{onAction:e.onClick,href:e.href,children:e.label},e.value))})]})]})})}),n=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"}]}}),m=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"},{label:"Long Breadcrumb Name",href:"/long-breadcrumb"}]}}),c=o.story({decorators:[a],args:{...t.input.args,tabs:l,customActions:r.jsx(h,{children:"Custom action"}),breadcrumbs:[{label:"Home",href:"/"}]}}),I=[{id:"overview",label:"Overview",href:"/overview"},{id:"docs-group",label:"Documentation",items:[{id:"docs",label:"TechDocs",href:"/docs"},{id:"api-docs",label:"API Reference",href:"/api-docs"}]},{id:"ci",label:"CI/CD",href:"/ci"}],p=o.story({decorators:[e=>r.jsx(d,{initialEntries:["/docs"],children:r.jsx(b,{children:r.jsx(e,{})})})],args:{...t.input.args,tabs:I}}),u=o.story({decorators:[a],args:{...t.input.args,tabs:l,activeTabId:"campaigns"}});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
