import{j as r,M as d,p as f}from"./iframe-KINrIo_f.js";import{H as g}from"./Header-D-Em1PzR.js";import{t as v}from"./index-Dv1l67z5.js";import{M as y,a as x,b as B}from"./Menu-s08ry3Au.js";import{B as w}from"./ButtonIcon-Brz4gTEW.js";import{B as b}from"./BUIProvider-Ciu3w9NY.js";import{B as h}from"./Button-DJZRNjgN.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-B_WSb347.js";import"./utils-Dp48jrsX.js";import"./useObjectRef-Cl-GJEjw.js";import"./Label-CJonN38k.js";import"./Hidden-CKUXjs7V.js";import"./useNumberFormatter-BRRCv1PA.js";import"./context-B896Pv5S.js";import"./useFocusable-CaaSd55t.js";import"./openLink-BCV1Ju3v.js";import"./useLabel-CtWiwLqZ.js";import"./useLabels-mheEzMbZ.js";import"./useButton-DEkJAlCo.js";import"./usePress-BRBPsLh-.js";import"./textSelection-1F9aHMh8.js";import"./useFocusRing-BZvEHQX6.js";import"./useLink-u3iPRNma.js";import"./Container-15j6_Tos.js";import"./Link-BaUc3-6X.js";import"./getNodeText-MPmDkoxK.js";import"./Text-CNN97s-C.js";import"./Autocomplete-B_tF8JCw.js";import"./RSPContexts-BB815QrL.js";import"./useEvent-BOGlR7Jp.js";import"./SelectionManager-D9gyKx5v.js";import"./SelectionIndicator-BhnE4v6J.js";import"./useControlledState-CmWPFpjF.js";import"./useLocalizedStringFormatter-Xx4C-qoc.js";import"./Separator-BNO8xXB0.js";import"./Input-DLCtCgi7.js";import"./useFormReset-CiyO9xzi.js";import"./useField-CQ_siFYl.js";import"./Form-Dteeinzj.js";import"./ListBox-Bzb_vCdk.js";import"./Text-BocnvHcP.js";import"./useListState-CvYuqVi3.js";import"./Dialog-Dw8Bysji.js";import"./OverlayArrow-C_Z2pH72.js";import"./animation-cEYBDaw2.js";import"./VisuallyHidden-B0kkQ8nV.js";import"./SearchField-Wca4BMVc.js";import"./FieldError-CHy2zJ6h.js";import"./Virtualizer-B-t3D24O.js";import"./linkUtils-tKDL5Jm1.js";import"./useFilter-6VG5hCfA.js";const o=f.meta({title:"Backstage UI/Header",component:g,parameters:{layout:"fullscreen"}}),l=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"},{id:"integrations",label:"Integrations",href:"/integrations"}],j=[{label:"Settings",value:"settings",href:"/settings"},{label:"Invite new members",value:"invite-new-members",href:"/invite-new-members"},{label:"Logout",value:"logout",onClick:()=>{alert("logout")}}],a=e=>r.jsx(d,{initialEntries:["/overview"],children:r.jsx(b,{children:r.jsx(e,{})})}),t=o.story({args:{title:"Page Title"}}),s=o.story({decorators:[a],args:{...t.input.args,tabs:l}}),i=o.story({decorators:[a],render:()=>r.jsx(g,{...t.input.args,customActions:r.jsxs(r.Fragment,{children:[r.jsx(h,{children:"Custom action"}),r.jsxs(y,{children:[r.jsx(w,{variant:"tertiary",icon:r.jsx(v,{}),"aria-label":"More options"}),r.jsx(x,{placement:"bottom end",children:j.map(e=>r.jsx(B,{onAction:e.onClick,href:e.href,children:e.label},e.value))})]})]})})}),n=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"}]}}),m=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"},{label:"Long Breadcrumb Name",href:"/long-breadcrumb"}]}}),c=o.story({decorators:[a],args:{...t.input.args,tabs:l,customActions:r.jsx(h,{children:"Custom action"}),breadcrumbs:[{label:"Home",href:"/"}]}}),I=[{id:"overview",label:"Overview",href:"/overview"},{id:"docs-group",label:"Documentation",items:[{id:"docs",label:"TechDocs",href:"/docs"},{id:"api-docs",label:"API Reference",href:"/api-docs"}]},{id:"ci",label:"CI/CD",href:"/ci"}],p=o.story({decorators:[e=>r.jsx(d,{initialEntries:["/docs"],children:r.jsx(b,{children:r.jsx(e,{})})})],args:{...t.input.args,tabs:I}}),u=o.story({decorators:[a],args:{...t.input.args,tabs:l,activeTabId:"campaigns"}});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
