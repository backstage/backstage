import{aN as x,r as b,aO as P,j as e,p as f,M as y}from"./iframe-DXL2wfUr.js";import{P as l}from"./PluginHeader-Bvd4DtWu.js";import{C as p}from"./Container-CySbv8uV.js";import{T as t}from"./Text-P2RscAk4.js";import{B as j}from"./BUIProvider-BLX9Ljti.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXp_o7O6.js";import"./utils-AUqHPGYf.js";import"./useObjectRef-B4LXbu6C.js";import"./useCollection-D0FRsmfu.js";import"./useFocusRing-Dz_6jVoa.js";import"./openLink-CjcP3ChZ.js";import"./Hidden-MswoXlTM.js";import"./keyboard-jTn08MKL.js";import"./getMetaValue-BT-1afLR.js";import"./FocusScope-B3Dyywws.js";import"./useEvent-C0-PIxi7.js";import"./I18nProvider-c1tBNH4d.js";import"./usePress-DEPKiAoD.js";import"./textSelection-AY9oPxK_.js";import"./useControlledState-B45g810H.js";import"./Link-DM72VPbd.js";import"./useLink-C1lHCnmb.js";import"./useHover-Ci84khs7.js";import"./useLocalizedStringFormatter-BmzZBpD6.js";import"./Button-BhsXa_hO.js";import"./Label-CTSb-hLZ.js";import"./useLabel-Dw1khwQq.js";import"./useLabels-CUtKyTJZ.js";import"./number-BBGa0xxY.js";import"./useButton-n2_J4JRw.js";import"./Menu-CR0MMKk2.js";import"./Autocomplete-_fWsJGvP.js";import"./useLoadMoreSentinel-1rmRafYn.js";import"./Input-DQSbawvQ.js";import"./ListBox-I69VL-h_.js";import"./SelectionIndicator-p9s5SMTk.js";import"./Text-Cfqlbe-2.js";import"./useListState-CxwtVQIj.js";import"./Dialog-Iyzg3pql.js";import"./Heading-FvuJcQ_2.js";import"./useOverlayTriggerState-CXXMw3IC.js";import"./VisuallyHidden-CS-IfeTZ.js";import"./animation-BTqVon43.js";import"./SearchField--YnbST4n.js";import"./FieldError-DXZIAafe.js";import"./Form-DQaPpS9D.js";import"./useFormValidation-C1WpA2q7.js";import"./useTextField-5QRXTDDq.js";import"./useField-ObDL9HD8.js";import"./useFormReset-DI4gv__R.js";import"./Virtualizer-CU6sjcnS.js";import"./useFilter-CB94jdj4.js";import"./getNodeText-BJYTkljx.js";import"./Link-DCzfmCx-.js";import"./useResolvedHref-C3ATKrxL.js";import"./Tooltip-BJKgG_We.js";import"./VisuallyHidden-C2hGpLZj.js";import"./Tabs-BUEYrZkM.js";import"./useHasTabbableChild-DRoqE8B_.js";import"./BUIRoutingProvider-DnSIApiV.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=P(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=f.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage style={{
      backgroundColor: '#c3f0ff'
    }}>
        <Container>
          <Text as="p">
            This content fills the remaining viewport height below the Header.
          </Text>
        </Container>
      </FullPage>
    </>
})`,...o.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage>
        <Container>
          <Text as="h2" variant="title-medium">
            Scrollable Content
          </Text>
          <Text as="p">
            The content below scrolls independently while the Header stays
            pinned at the top.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...a.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" tabs={tabs} />
      <FullPage>
        <Container>
          <Text as="p">
            The FullPage height adjusts automatically when the Header includes
            tabs, thanks to the ResizeObserver measuring the Header's actual
            height.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...s.input.parameters?.docs?.source}}};const _e=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,_e as __namedExportsOrder};
