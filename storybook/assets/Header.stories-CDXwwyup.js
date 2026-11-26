import{R as u,r as q,j as e,p as G}from"./iframe-C8V0qqb2.js";import{H as l}from"./Header-D3ZD1hQF.js";import{$ as V,a as J,b as K}from"./useObjectRef-Bmpa_pzq.js";import{$ as Q}from"./usePress-DxDbMcWz.js";import{$ as X}from"./useFocusRing-A5enshti.js";import{L as $}from"./Link-DL_DXNWK.js";import{A as m}from"./Avatar-B9FXqcIn.js";import{T as O}from"./Text-DCzxn_GK.js";import{T as Y,a as Z}from"./Tooltip-Cd1w41ri.js";import{T as U}from"./TestRouter-gzyzuKmX.js";import{t as ee}from"./index-X2scoYBO.js";import{C as L}from"./Container-DANipgL2.js";import{a as te,b as ae,M as re}from"./Menu-DvYg4PQe.js";import{B as N}from"./BUIProvider-sHU7Fnoa.js";import{B as p}from"./Button-D1qn0RUS.js";import{B as se}from"./ButtonIcon-BcbsxwMp.js";import"./preload-helper-PPVm8Dsz.js";import"./useHover-BM2aAfmJ.js";import"./useLink-C3y3JK0h.js";import"./Button-BEmepp9I.js";import"./utils-D2G7Gr3-.js";import"./Label-lDwdRkmF.js";import"./Hidden-DiQ-sckr.js";import"./useLabel-Du92kFjZ.js";import"./useLabels-D_iZwDzY.js";import"./number-BQr42Lr5.js";import"./I18nProvider-Cjl-_wzY.js";import"./useButton-dvUW2Qss.js";import"./BUIRoutingProvider-BxHvEIyM.js";import"./textSelection-DSE97Rz3.js";import"./getMetaValue-Cs0hmg7u.js";import"./getNodeText-Bt7Ku3rS.js";import"./useOverlayTriggerState-BJpvAEhl.js";import"./useControlledState-CSkhWUnX.js";import"./animation-CQDNL3hS.js";import"./index-CZTs28Z5.js";import"./Autocomplete-F_-RRsBG.js";import"./keyboard-C8VvzxKH.js";import"./useEvent-8_12ARkl.js";import"./useLocalizedStringFormatter-BSUQ5ifA.js";import"./useLoadMoreSentinel-D-NY2IrU.js";import"./useCollection-BWA8DlX5.js";import"./FocusScope-QAIUBJGW.js";import"./Input-C6rRPFvc.js";import"./ListBox-Ci7SfdT3.js";import"./SelectionIndicator-BqCnbUA9.js";import"./Text-C3Fp9zoI.js";import"./useListState-NmGMDQQG.js";import"./Dialog-R49q_bbw.js";import"./Heading-Cq8dttCG.js";import"./VisuallyHidden-CoLsK902.js";import"./SearchField-rGiMC4mQ.js";import"./FieldError-B6JD0CK_.js";import"./Form-ro32D7sS.js";import"./useFormValidation-DCkaOoFr.js";import"./useTextField-DZRsoRku.js";import"./useField-CnWanIwr.js";import"./useFormReset-BkDzJlqC.js";import"./Virtualizer-COa5zYj7.js";import"./useFilter-CFwrG83c.js";const oe=u.forwardRef(({children:a,...t},n)=>{n=V(n);let{pressProps:F}=Q({...t,ref:n}),{focusableProps:E}=X(t,n),d=u.Children.only(a);q.useEffect(()=>{},[n,t.isDisabled]);let z=parseInt(u.version,10)<19?d.ref:d.props.ref;return u.cloneElement(d,{...K(F,E,d.props),ref:J(z,n)})}),ie="_single_115qp_20",ne="_stack_115qp_27",le="_avatarLink_115qp_37",h={single:ie,stack:ne,avatarLink:le},c=({users:a})=>{if(a.length===0)return null;if(a.length===1){const t=a[0];return t.href?e.jsxs($,{href:t.href,variant:"body-medium",standalone:!0,className:h.single,children:[e.jsx(m,{src:t.src??"data:,",name:t.name,size:"small",purpose:"decoration"}),t.name]}):e.jsxs("div",{className:h.single,children:[e.jsx(m,{src:t.src??"data:,",name:t.name,size:"small",purpose:"decoration"}),e.jsx(O,{variant:"body-medium",children:t.name})]})}return e.jsx("ul",{className:h.stack,children:a.map((t,n)=>e.jsx("li",{children:e.jsxs(Y,{children:[t.href?e.jsx($,{href:t.href,"aria-label":t.name,className:h.avatarLink,children:e.jsx(m,{src:t.src??"data:,",name:t.name,size:"small",purpose:"decoration"})}):e.jsx(oe,{children:e.jsx(m,{src:t.src??"data:,",name:t.name,size:"small",purpose:"informative"})}),e.jsx(Z,{children:t.name})]})},t.href??`${n}:${t.name}`))})};c.__docgenInfo={description:`Displays a list of users as avatars inside a Header metadata value.
A single user shows the avatar with their name beside it.
Multiple users show avatars in a row with the name revealed on hover via tooltip.
When a user has an \`href\`, the avatar and name become links.

@public`,methods:[],displayName:"HeaderMetadataUsers",props:{users:{required:!0,tsType:{name:"Array",elements:[{name:"HeaderMetadataUser"}],raw:"HeaderMetadataUser[]"},description:""}}};const ce="_single_12dtd_20",pe="_dot_12dtd_27",I={single:ce,dot:pe,"dot-danger":"_dot-danger_12dtd_34","dot-warning":"_dot-warning_12dtd_38","dot-success":"_dot-success_12dtd_42","dot-info":"_dot-info_12dtd_46"},P=({label:a,color:t,href:n})=>e.jsxs("div",{className:I.single,children:[e.jsx("span",{"aria-hidden":"true",className:`${I.dot} ${I[`dot-${t}`]}`}),e.jsx(O,{variant:"body-medium",children:n?e.jsx($,{href:n,standalone:!0,children:a}):a})]});P.__docgenInfo={description:`Displays a single status indicator as a colored dot with a label inside a
Header metadata value. Optionally renders the label as a link when href is provided.

@public`,methods:[],displayName:"HeaderMetadataStatus",props:{label:{required:!0,tsType:{name:"string"},description:""},color:{required:!0,tsType:{name:"union",raw:"'danger' | 'warning' | 'success' | 'info'",elements:[{name:"literal",value:"'danger'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'success'"},{name:"literal",value:"'info'"}]},description:""},href:{required:!1,tsType:{name:"string"},description:""}}};const s=G.meta({title:"Backstage UI/Header",component:l,parameters:{layout:"fullscreen"}}),R=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"},{id:"integrations",label:"Integrations",href:"/integrations"}],de=[{label:"Settings",value:"settings",href:"/settings"},{label:"Invite new members",value:"invite-new-members",href:"/invite-new-members"},{label:"Logout",value:"logout",onClick:()=>{alert("logout")}}],i=a=>e.jsx(U,{initialEntries:["/overview"],children:e.jsx(N,{children:e.jsx(a,{})})}),o=s.story({args:{title:"Page Title"}}),b=s.story({decorators:[i],args:{...o.input.args,tabs:R}}),g=s.story({decorators:[i],render:()=>e.jsx(l,{...o.input.args,customActions:e.jsxs(e.Fragment,{children:[e.jsx(p,{children:"Custom action"}),e.jsxs(te,{children:[e.jsx(se,{variant:"tertiary",icon:e.jsx(ee,{}),"aria-label":"More options"}),e.jsx(ae,{placement:"bottom end",children:de.map(a=>e.jsx(re,{onAction:a.onClick,href:a.href,children:a.label},a.value))})]})]})})}),f=s.story({decorators:[i],args:{...o.input.args,breadcrumbs:[{label:"Home",href:"/"}]}}),y=s.story({decorators:[i],args:{...o.input.args,breadcrumbs:[{label:"Home",href:"/"},{label:"Long Breadcrumb Name",href:"/long-breadcrumb"}]}}),w=s.story({decorators:[i],args:{...o.input.args,description:"This is a description of the page. It can include [inline links](https://backstage.io)."}}),v=s.story({decorators:[i],args:{...o.input.args,tags:[{label:"TypeScript"},{label:"Platform",href:"/platform"},{label:"Gold"}]}}),x=s.story({decorators:[i],args:{...o.input.args,metadata:[{label:"Owner",value:"platform-team"},{label:"Type",value:"website"}]}}),r={giles:{name:"Giles Peyton-Nicoll",src:"https://i.pravatar.cc/150?u=giles",href:"/users/giles"},alice:{name:"Alice Johnson",src:"https://i.pravatar.cc/150?u=alicej",href:"/users/alice"},bob:{name:"Bob Smith",src:"https://i.pravatar.cc/150?u=bob",href:"/users/bob"},carol:{name:"Carol Williams",src:"https://i.pravatar.cc/150?u=carol",href:"/users/carol"}},T=s.story({decorators:[i],render:()=>e.jsx(l,{...o.input.args,metadata:[{label:"Owner",value:e.jsx(c,{users:[r.giles]})},{label:"Contributors",value:e.jsx(c,{users:[r.alice,r.bob,r.carol]})}]})}),S=s.story({decorators:[i],render:()=>e.jsx(l,{...o.input.args,metadata:[{label:"Owner",value:e.jsx(c,{users:[{name:r.giles.name,src:r.giles.src}]})},{label:"Contributors",value:e.jsx(c,{users:[{name:r.alice.name,src:r.alice.src},{name:r.bob.name,src:r.bob.src},{name:r.carol.name,src:r.carol.src}]})}]})}),j=s.story({decorators:[i],render:()=>e.jsx(l,{...o.input.args,metadata:[{label:"Status",value:e.jsx(P,{label:"Passing",color:"success"})},{label:"Build",value:e.jsx(P,{label:"Failed",color:"danger",href:"/builds/123"})},{label:"Coverage",value:e.jsx(P,{label:"Warning",color:"warning"})}]})}),k=s.story({decorators:[i],render:()=>e.jsx(l,{...o.input.args,description:"This is a description of the page. It can include [inline links](https://backstage.io).",tags:[{label:"TypeScript"},{label:"Platform",href:"/platform"},{label:"Gold"}],metadata:[{label:"Owner",value:e.jsx(c,{users:[r.giles]})},{label:"Contributors",value:e.jsx(c,{users:[r.alice,r.bob,r.carol]})},{label:"Type",value:"website"},{label:"Tier",value:"gold"}]})}),C=s.story({decorators:[i],render:()=>e.jsx(l,{...o.input.args,tabs:R,customActions:e.jsx(p,{children:"Custom action"}),breadcrumbs:[{label:"Home",href:"/"}],description:"This is a description of the page. It can include [inline links](https://backstage.io).",tags:[{label:"TypeScript"},{label:"Platform",href:"/platform"},{label:"Gold"}],metadata:[{label:"Type",value:"website"},{label:"Owner",value:e.jsx(c,{users:[r.giles]})},{label:"Contributors",value:e.jsx(c,{users:[r.alice,r.bob,r.carol]})}]})}),ue=[{id:"overview",label:"Overview",href:"/overview"},{id:"docs-group",label:"Documentation",items:[{id:"docs",label:"TechDocs",href:"/docs"},{id:"api-docs",label:"API Reference",href:"/api-docs"}]},{id:"ci",label:"CI/CD",href:"/ci"}],B=s.story({decorators:[a=>e.jsx(U,{initialEntries:["/docs"],children:e.jsx(N,{children:e.jsx(a,{})})})],args:{...o.input.args,tabs:ue}}),H=s.story({decorators:[i,a=>e.jsx("div",{style:{width:480,maxWidth:"100%",resize:"horizontal",overflow:"hidden"},children:e.jsx(a,{})})],args:{...o.input.args,tabs:[...R,...["Dependencies","Deployments","Pull Requests","Documentation","API Definition","Cost Insights","Security Scans","Feature Flags","On-call Schedule"].map(a=>({id:a.toLowerCase().replace(/ /g,"-"),label:a,href:`/${a.toLowerCase().replace(/ /g,"-")}`}))]}}),M=s.story({decorators:[i],args:{...o.input.args,tabs:R,activeTabId:"campaigns"}}),_=s.story({decorators:[i],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"Sticky Page Title",description:"This is a description of the page that scrolls away when you scroll down.",tags:[{label:"TypeScript"},{label:"Platform",href:"/platform"}],metadata:[{label:"Owner",value:"platform-team"},{label:"Type",value:"website"}],customActions:e.jsx(p,{children:"Custom action"})}),e.jsx(L,{pb:"3",children:Array.from({length:60},(a,t)=>e.jsxs("p",{style:{marginBottom:"16px"},children:["Scroll down to see the entire header scroll away with the rest of the page content. Line ",t+1,"."]},t))})]})}),W=s.story({decorators:[i],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"Sticky Page Title",sticky:!0,description:"This is a description of the page that scrolls away when you scroll down.",tags:[{label:"TypeScript"},{label:"Platform",href:"/platform"}],metadata:[{label:"Owner",value:"platform-team"},{label:"Type",value:"website"}],customActions:e.jsx(p,{children:"Custom action"})}),e.jsx(L,{pb:"3",children:Array.from({length:60},(a,t)=>e.jsxs("p",{style:{marginBottom:"16px"},children:["Scroll down to see the title bar stick to the top while the tags, description, and metadata scroll away. Line ",t+1,"."]},t))})]})}),A=s.story({decorators:[i],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"This is a very long page title that should demonstrate how the sticky Header behaves when the title takes up significantly more horizontal space than usual",sticky:!0,description:"This is a description of the page that scrolls away when you scroll down.",tags:[{label:"TypeScript"},{label:"Platform",href:"/platform"}],metadata:[{label:"Owner",value:"platform-team"},{label:"Type",value:"website"}],customActions:e.jsx(p,{children:"Custom action"})}),e.jsx(L,{pb:"3",children:Array.from({length:60},(a,t)=>e.jsxs("p",{style:{marginBottom:"16px"},children:["Scroll down to see the long title bar stick to the top while the tags, description, and metadata scroll away. Line ",t+1,"."]},t))})]})}),D=s.story({decorators:[i],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"This is a very long page title that should demonstrate how sticky breadcrumbs and titles behave when both need to fit in the compact stuck state",sticky:!0,breadcrumbs:[{label:"Home",href:"/"},{label:"Very Long Breadcrumb Name",href:"/long-breadcrumb"}],description:"This is a description of the page that scrolls away when you scroll down.",tags:[{label:"TypeScript"},{label:"Platform",href:"/platform"}],metadata:[{label:"Owner",value:"platform-team"},{label:"Type",value:"website"}],customActions:e.jsx(p,{children:"Custom action"})}),e.jsx(L,{pb:"3",children:Array.from({length:60},(a,t)=>e.jsxs("p",{style:{marginBottom:"16px"},children:["Scroll down to see the breadcrumb and long title bar stick to the top while the tags, description, and metadata scroll away. Line"," ",t+1,"."]},t))})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    title: 'Page Title'
  }
})`,...o.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    tabs
  }
})`,...b.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...g.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    breadcrumbs: [{
      label: 'Home',
      href: '/'
    }]
  }
})`,...f.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...y.input.parameters?.docs?.source}}};w.input.parameters={...w.input.parameters,docs:{...w.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    description: 'This is a description of the page. It can include [inline links](https://backstage.io).'
  }
})`,...w.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    tags: [{
      label: 'TypeScript'
    }, {
      label: 'Platform',
      href: '/platform'
    }, {
      label: 'Gold'
    }]
  }
})`,...v.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    metadata: [{
      label: 'Owner',
      value: 'platform-team'
    }, {
      label: 'Type',
      value: 'website'
    }]
  }
})`,...x.input.parameters?.docs?.source}}};T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <Header {...Default.input.args} metadata={[{
    label: 'Owner',
    value: <HeaderMetadataUsers users={[users.giles]} />
  }, {
    label: 'Contributors',
    value: <HeaderMetadataUsers users={[users.alice, users.bob, users.carol]} />
  }]} />
})`,...T.input.parameters?.docs?.source}}};S.input.parameters={...S.input.parameters,docs:{...S.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <Header {...Default.input.args} metadata={[{
    label: 'Owner',
    value: <HeaderMetadataUsers users={[{
      name: users.giles.name,
      src: users.giles.src
    }]} />
  }, {
    label: 'Contributors',
    value: <HeaderMetadataUsers users={[{
      name: users.alice.name,
      src: users.alice.src
    }, {
      name: users.bob.name,
      src: users.bob.src
    }, {
      name: users.carol.name,
      src: users.carol.src
    }]} />
  }]} />
})`,...S.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <Header {...Default.input.args} metadata={[{
    label: 'Status',
    value: <HeaderMetadataStatus label="Passing" color="success" />
  }, {
    label: 'Build',
    value: <HeaderMetadataStatus label="Failed" color="danger" href="/builds/123" />
  }, {
    label: 'Coverage',
    value: <HeaderMetadataStatus label="Warning" color="warning" />
  }]} />
})`,...j.input.parameters?.docs?.source}}};k.input.parameters={...k.input.parameters,docs:{...k.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <Header {...Default.input.args} description="This is a description of the page. It can include [inline links](https://backstage.io)." tags={[{
    label: 'TypeScript'
  }, {
    label: 'Platform',
    href: '/platform'
  }, {
    label: 'Gold'
  }]} metadata={[{
    label: 'Owner',
    value: <HeaderMetadataUsers users={[users.giles]} />
  }, {
    label: 'Contributors',
    value: <HeaderMetadataUsers users={[users.alice, users.bob, users.carol]} />
  }, {
    label: 'Type',
    value: 'website'
  }, {
    label: 'Tier',
    value: 'gold'
  }]} />
})`,...k.input.parameters?.docs?.source}}};C.input.parameters={...C.input.parameters,docs:{...C.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <Header {...Default.input.args} tabs={tabs} customActions={<Button>Custom action</Button>} breadcrumbs={[{
    label: 'Home',
    href: '/'
  }]} description="This is a description of the page. It can include [inline links](https://backstage.io)." tags={[{
    label: 'TypeScript'
  }, {
    label: 'Platform',
    href: '/platform'
  }, {
    label: 'Gold'
  }]} metadata={[{
    label: 'Type',
    value: 'website'
  }, {
    label: 'Owner',
    value: <HeaderMetadataUsers users={[users.giles]} />
  }, {
    label: 'Contributors',
    value: <HeaderMetadataUsers users={[users.alice, users.bob, users.carol]} />
  }]} />
})`,...C.input.parameters?.docs?.source}}};B.input.parameters={...B.input.parameters,docs:{...B.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [(Story: StoryFn) => <TestRouter initialEntries={['/docs']}>
        <BUIProvider>
          <Story />
        </BUIProvider>
      </TestRouter>],
  args: {
    ...Default.input.args,
    tabs: groupedTabs
  }
})`,...B.input.parameters?.docs?.source}}};H.input.parameters={...H.input.parameters,docs:{...H.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter, (Story: StoryFn) => <div style={{
    width: 480,
    maxWidth: '100%',
    resize: 'horizontal',
    overflow: 'hidden'
  }}>
        <Story />
      </div>],
  args: {
    ...Default.input.args,
    tabs: [...tabs, ...['Dependencies', 'Deployments', 'Pull Requests', 'Documentation', 'API Definition', 'Cost Insights', 'Security Scans', 'Feature Flags', 'On-call Schedule'].map(label => ({
      id: label.toLowerCase().replace(/ /g, '-'),
      label,
      href: \`/\${label.toLowerCase().replace(/ /g, '-')}\`
    }))]
  }
})`,...H.input.parameters?.docs?.source}}};M.input.parameters={...M.input.parameters,docs:{...M.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    tabs,
    activeTabId: 'campaigns'
  }
})`,...M.input.parameters?.docs?.source}}};_.input.parameters={..._.input.parameters,docs:{..._.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <Header title="Sticky Page Title" description="This is a description of the page that scrolls away when you scroll down." tags={[{
      label: 'TypeScript'
    }, {
      label: 'Platform',
      href: '/platform'
    }]} metadata={[{
      label: 'Owner',
      value: 'platform-team'
    }, {
      label: 'Type',
      value: 'website'
    }]} customActions={<Button>Custom action</Button>} />
      <Container pb="3">
        {Array.from({
        length: 60
      }, (_, i) => <p key={i} style={{
        marginBottom: '16px'
      }}>
            Scroll down to see the entire header scroll away with the rest of
            the page content. Line {i + 1}.
          </p>)}
      </Container>
    </>
})`,..._.input.parameters?.docs?.source}}};W.input.parameters={...W.input.parameters,docs:{...W.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <Header title="Sticky Page Title" sticky description="This is a description of the page that scrolls away when you scroll down." tags={[{
      label: 'TypeScript'
    }, {
      label: 'Platform',
      href: '/platform'
    }]} metadata={[{
      label: 'Owner',
      value: 'platform-team'
    }, {
      label: 'Type',
      value: 'website'
    }]} customActions={<Button>Custom action</Button>} />
      <Container pb="3">
        {Array.from({
        length: 60
      }, (_, i) => <p key={i} style={{
        marginBottom: '16px'
      }}>
            Scroll down to see the title bar stick to the top while the tags,
            description, and metadata scroll away. Line {i + 1}.
          </p>)}
      </Container>
    </>
})`,...W.input.parameters?.docs?.source}}};A.input.parameters={...A.input.parameters,docs:{...A.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <Header title="This is a very long page title that should demonstrate how the sticky Header behaves when the title takes up significantly more horizontal space than usual" sticky description="This is a description of the page that scrolls away when you scroll down." tags={[{
      label: 'TypeScript'
    }, {
      label: 'Platform',
      href: '/platform'
    }]} metadata={[{
      label: 'Owner',
      value: 'platform-team'
    }, {
      label: 'Type',
      value: 'website'
    }]} customActions={<Button>Custom action</Button>} />
      <Container pb="3">
        {Array.from({
        length: 60
      }, (_, i) => <p key={i} style={{
        marginBottom: '16px'
      }}>
            Scroll down to see the long title bar stick to the top while the
            tags, description, and metadata scroll away. Line {i + 1}.
          </p>)}
      </Container>
    </>
})`,...A.input.parameters?.docs?.source}}};D.input.parameters={...D.input.parameters,docs:{...D.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <Header title="This is a very long page title that should demonstrate how sticky breadcrumbs and titles behave when both need to fit in the compact stuck state" sticky breadcrumbs={[{
      label: 'Home',
      href: '/'
    }, {
      label: 'Very Long Breadcrumb Name',
      href: '/long-breadcrumb'
    }]} description="This is a description of the page that scrolls away when you scroll down." tags={[{
      label: 'TypeScript'
    }, {
      label: 'Platform',
      href: '/platform'
    }]} metadata={[{
      label: 'Owner',
      value: 'platform-team'
    }, {
      label: 'Type',
      value: 'website'
    }]} customActions={<Button>Custom action</Button>} />
      <Container pb="3">
        {Array.from({
        length: 60
      }, (_, i) => <p key={i} style={{
        marginBottom: '16px'
      }}>
            Scroll down to see the breadcrumb and long title bar stick to the
            top while the tags, description, and metadata scroll away. Line{' '}
            {i + 1}.
          </p>)}
      </Container>
    </>
})`,...D.input.parameters?.docs?.source}}};const wt=["Default","WithTabs","WithCustomActions","WithBreadcrumbs","WithLongBreadcrumbs","WithDescription","WithTags","WithMetadata","WithMetadataUsers","WithMetadataUsersNoLinks","WithMetadataStatus","WithDescriptionTagsAndMetadata","WithEverything","WithGroupedTabs","WithManyTabs","WithExplicitActiveTab","NonSticky","Sticky","StickyWithLongTitle","StickyWithBreadcrumbsAndLongTitle"];export{o as Default,_ as NonSticky,W as Sticky,D as StickyWithBreadcrumbsAndLongTitle,A as StickyWithLongTitle,f as WithBreadcrumbs,g as WithCustomActions,w as WithDescription,k as WithDescriptionTagsAndMetadata,C as WithEverything,M as WithExplicitActiveTab,B as WithGroupedTabs,y as WithLongBreadcrumbs,H as WithManyTabs,x as WithMetadata,j as WithMetadataStatus,T as WithMetadataUsers,S as WithMetadataUsersNoLinks,b as WithTabs,v as WithTags,wt as __namedExportsOrder};
