import{aO as x,r as b,aP as P,j as e,p as f,M as y}from"./iframe-DOtOeTqo.js";import{P as l}from"./PluginHeader-CrEBfi2q.js";import{C as p}from"./Container-WfwirRIa.js";import{T as t}from"./Text-oWMdABsL.js";import{B as j}from"./BUIProvider-DMOlRvK1.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BlBcDPbs.js";import"./utils-pgFMei_k.js";import"./useObjectRef-BWUUeiPu.js";import"./useCollection-ywvIf1ZR.js";import"./useFocusRing-BXb8q1JL.js";import"./openLink-CJNg7ARK.js";import"./Hidden-CxPa8WIq.js";import"./keyboard-Dpz_eYv5.js";import"./FocusScope-8l1FH1do.js";import"./useEvent-KvN5j0jW.js";import"./I18nProvider-DuDY5T7I.js";import"./usePress-BQ7zB3R2.js";import"./textSelection-8fES9RA1.js";import"./useControlledState-BfKz3a4E.js";import"./Link-B5Izhaq5.js";import"./useLink-C5Ok2pWw.js";import"./useHover-CLTRyNT2.js";import"./useLocalizedStringFormatter-BO4d3GOf.js";import"./Button-BEAJi762.js";import"./Label-BxIKHFQ8.js";import"./useLabel-DH87djdw.js";import"./useLabels-BnFtLpP2.js";import"./number-Bmc2WaUx.js";import"./useButton-nXyYv-0V.js";import"./Menu-CRieYxkQ.js";import"./Autocomplete-CvKotD4o.js";import"./getItemCount-DQUCnSau.js";import"./Input-CoNrOVCs.js";import"./ListBox-BTKNHs4G.js";import"./Text-CUFEUyEl.js";import"./useListState-BmjKsDQ8.js";import"./Dialog-CiCl0SZu.js";import"./Heading-Ct93H_J-.js";import"./useOverlayTriggerState-CMprxMq5.js";import"./VisuallyHidden-LCnCHlaD.js";import"./animation-PioyXRyy.js";import"./SearchField-CRR7sSDC.js";import"./FieldError-BZUytoyE.js";import"./useFormValidation-NUNxJZWW.js";import"./useTextField-JZBlAGZ1.js";import"./useField-M0TANDTX.js";import"./useFormReset-DPXLv5Gr.js";import"./Virtualizer-DPvnqRcH.js";import"./useFilter-MznAiwUS.js";import"./getNodeText-S38ODEZL.js";import"./Link-B3oEvCNi.js";import"./useResolvedHref-DUUdLYVO.js";import"./Tooltip-BpL3QK8E.js";import"./VisuallyHidden-Cnf5jxGD.js";import"./Tabs-B-MUNZJB.js";import"./useHasTabbableChild-Bjh9h_xQ.js";import"./BUIRoutingProvider-CCMgpbyZ.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
})`,...s.input.parameters?.docs?.source}}};const Se=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,Se as __namedExportsOrder};
