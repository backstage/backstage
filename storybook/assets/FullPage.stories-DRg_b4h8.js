import{bg as b,ca as x,cH as P,bR as e,c7 as f,w as y}from"./iframe-C134ftd_.js";import{P as l}from"./PluginHeader-CH-hWN3n.js";import{C as p}from"./Container-BOth5Qjl.js";import{T as t}from"./Text-CMUSX-Wb.js";import{B as j}from"./BUIProvider-B4jZ-KWm.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CFfinTmq.js";import"./utils-ZhLQjZIu.js";import"./useObjectRef-CpAZkPjD.js";import"./useCollection-BLpgqlp1.js";import"./useFocusRing-CEbL5n3V.js";import"./openLink-CXjQqT5j.js";import"./Hidden-Bciv724x.js";import"./keyboard-DADZJZiJ.js";import"./FocusScope-B-HDfZvI.js";import"./useEvent-B_Hi0sbr.js";import"./I18nProvider-C3aQlN23.js";import"./usePress-DEZzIpor.js";import"./textSelection-DpSIhvEg.js";import"./useControlledState-BrUi6TrE.js";import"./Link-Bv_CUNjA.js";import"./useLink-CvAJYkR_.js";import"./useHover-crLX5QKB.js";import"./useLocalizedStringFormatter-gRbl-cPk.js";import"./Button-DokUs05S.js";import"./Label-NvoSwhWO.js";import"./useLabel-BlNKan1O.js";import"./useLabels-DE_o1GVW.js";import"./number-DOH9yOte.js";import"./useButton-DhiKPbl2.js";import"./Menu-CnFQxxnP.js";import"./Autocomplete-BAT25Rh4.js";import"./getItemCount-Dnk46TUF.js";import"./Input-BaAA-Nyt.js";import"./ListBox-DK43SL3j.js";import"./Text-rWPrkzXG.js";import"./useListState-1wcvBglp.js";import"./Dialog-CJvfjboe.js";import"./Heading-pVOpDmGw.js";import"./useOverlayTriggerState-CWuf6Tnn.js";import"./VisuallyHidden-nqqisxk3.js";import"./animation-D0n23P1z.js";import"./SearchField-Bquvp4Zp.js";import"./FieldError-D65LPVQm.js";import"./useFormValidation-s9lT5xWl.js";import"./useTextField-C8rV1cT7.js";import"./useField-By1WoCRi.js";import"./useFormReset-CQi6w5nh.js";import"./Virtualizer-BYSSu0yk.js";import"./useFilter-zE2QSO7i.js";import"./getNodeText-DIG2obC3.js";import"./Link-DaM3SP41.js";import"./useResolvedHref-BJj8JYmh.js";import"./Tooltip-tSI9KshH.js";import"./VisuallyHidden-Bmf-TFcl.js";import"./Tabs-DphOA2zw.js";import"./useHasTabbableChild-BjZk7IaE.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
})`,...s.input.parameters?.docs?.source}}};const ke=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,ke as __namedExportsOrder};
