import{j as r,M as d,p as f}from"./iframe-DgHKkkyr.js";import{H as g}from"./Header-C0TwqAou.js";import{t as v}from"./index-DXCmj24P.js";import{M as y,a as x,b as B}from"./Menu-DY8rnfVU.js";import{B as w}from"./ButtonIcon-Bm8Vpkop.js";import{B as b}from"./BUIProvider-BzXDCe8S.js";import{B as h}from"./Button-RPoPv-4P.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-DQWFpuFN.js";import"./utils-C1o7BLsy.js";import"./useObjectRef-DMH-GBhM.js";import"./Label-DFt2BgeJ.js";import"./Hidden-DNRCN_ic.js";import"./useNumberFormatter-BariNU_U.js";import"./context-BV7aFW6r.js";import"./useFocusable-B6BeVSwN.js";import"./openLink-iVgFRcvl.js";import"./useLabel-RftGCJTm.js";import"./useLabels-BOBl8S-u.js";import"./useButton-BS5Nc_U6.js";import"./usePress-yYF-Bh9Q.js";import"./textSelection-DDomQQoV.js";import"./useFocusRing-qkMzq-Jc.js";import"./useLink-BrQ1SlEe.js";import"./Container-B2T82-er.js";import"./Link-3vKfxsv2.js";import"./getNodeText-B4ekQBTF.js";import"./Text-DfksO4NV.js";import"./Autocomplete-uQP7CcgL.js";import"./RSPContexts-BpYxsdfF.js";import"./useEvent-HT8lmTYY.js";import"./SelectionManager-R8d54xYK.js";import"./SelectionIndicator-DxQ47DhH.js";import"./useControlledState-CkXk69k2.js";import"./useLocalizedStringFormatter-BOuFZVr0.js";import"./Separator-DkbZUtJM.js";import"./Input-Bdlb1wRc.js";import"./useFormReset-CGr6igTR.js";import"./useField-C-krdq7-.js";import"./Form-xwKRiiJQ.js";import"./ListBox-BoDwWUhY.js";import"./Text-Br96A3dM.js";import"./useListState-CXyrRuyQ.js";import"./Dialog-DZwDG78Z.js";import"./OverlayArrow-BanbCYZ7.js";import"./animation-CtoIKT8l.js";import"./VisuallyHidden-DFvP1mHt.js";import"./SearchField-C-2zpTuF.js";import"./FieldError-diMKG1Az.js";import"./Virtualizer-DiKcu-gk.js";import"./linkUtils-tKDL5Jm1.js";import"./useFilter-yIjTxLrL.js";const o=f.meta({title:"Backstage UI/Header",component:g,parameters:{layout:"fullscreen"}}),l=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"},{id:"integrations",label:"Integrations",href:"/integrations"}],j=[{label:"Settings",value:"settings",href:"/settings"},{label:"Invite new members",value:"invite-new-members",href:"/invite-new-members"},{label:"Logout",value:"logout",onClick:()=>{alert("logout")}}],a=e=>r.jsx(d,{initialEntries:["/overview"],children:r.jsx(b,{children:r.jsx(e,{})})}),t=o.story({args:{title:"Page Title"}}),s=o.story({decorators:[a],args:{...t.input.args,tabs:l}}),i=o.story({decorators:[a],render:()=>r.jsx(g,{...t.input.args,customActions:r.jsxs(r.Fragment,{children:[r.jsx(h,{children:"Custom action"}),r.jsxs(y,{children:[r.jsx(w,{variant:"tertiary",icon:r.jsx(v,{}),"aria-label":"More options"}),r.jsx(x,{placement:"bottom end",children:j.map(e=>r.jsx(B,{onAction:e.onClick,href:e.href,children:e.label},e.value))})]})]})})}),n=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"}]}}),m=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"},{label:"Long Breadcrumb Name",href:"/long-breadcrumb"}]}}),c=o.story({decorators:[a],args:{...t.input.args,tabs:l,customActions:r.jsx(h,{children:"Custom action"}),breadcrumbs:[{label:"Home",href:"/"}]}}),I=[{id:"overview",label:"Overview",href:"/overview"},{id:"docs-group",label:"Documentation",items:[{id:"docs",label:"TechDocs",href:"/docs"},{id:"api-docs",label:"API Reference",href:"/api-docs"}]},{id:"ci",label:"CI/CD",href:"/ci"}],p=o.story({decorators:[e=>r.jsx(d,{initialEntries:["/docs"],children:r.jsx(b,{children:r.jsx(e,{})})})],args:{...t.input.args,tabs:I}}),u=o.story({decorators:[a],args:{...t.input.args,tabs:l,activeTabId:"campaigns"}});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
