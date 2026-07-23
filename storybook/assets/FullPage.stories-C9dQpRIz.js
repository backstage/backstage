import{bg as b,ca as x,cH as P,bR as e,c7 as f,w as y}from"./iframe-DEB_XKCy.js";import{P as l}from"./PluginHeader-CjDZr1xI.js";import{C as p}from"./Container-D1zUsvm5.js";import{T as t}from"./Text-CEG9LOkG.js";import{B as j}from"./BUIProvider-DyDpRobm.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BI-bQJz8.js";import"./utils-CrlF93yQ.js";import"./useObjectRef-Ctp5tGlo.js";import"./useCollection-CPv6Fmqr.js";import"./useFocusRing-DOwaR7bd.js";import"./openLink-D4lCVjTw.js";import"./Hidden-Bcf80zYT.js";import"./keyboard-B5QxFQnB.js";import"./FocusScope-CZYPBkiN.js";import"./useEvent-DFdiJ6W_.js";import"./I18nProvider-BHXvn5NR.js";import"./usePress-RLqNI-Pb.js";import"./textSelection-LJfdl7Co.js";import"./useControlledState-CdUkXr5H.js";import"./Link-CfSYiVnQ.js";import"./useLink-D_qnMp0h.js";import"./useHover-BBgMw-bK.js";import"./useLocalizedStringFormatter-BXfXtci2.js";import"./Button-CD6RS4NW.js";import"./Label-CunX4hTS.js";import"./useLabel-CTUJJsAz.js";import"./useLabels-BcoDEarN.js";import"./number-DUI_xCBM.js";import"./useButton-DVtgz3c1.js";import"./Menu-Co5KFKJI.js";import"./Autocomplete-DlCmDG_G.js";import"./getItemCount-_-qK9cjX.js";import"./Input-BCWvt78D.js";import"./ListBox-Cm2QwHIq.js";import"./Text-C3mE0SGj.js";import"./useListState-BEwA7cae.js";import"./Dialog-DvvYxolb.js";import"./Heading-D1IKxfRQ.js";import"./useOverlayTriggerState-Bzrpe4h8.js";import"./VisuallyHidden-Di5CO8Lh.js";import"./animation-EQr5ceW1.js";import"./SearchField-BAlpRwur.js";import"./FieldError-riGjFw4K.js";import"./useFormValidation-CyDnBQXe.js";import"./useTextField-AejuSCEH.js";import"./useField-BccbeYM4.js";import"./useFormReset-BChojrP9.js";import"./Virtualizer-nDVy_Eti.js";import"./useFilter-CRg0ZZez.js";import"./getNodeText-8S4cGMZL.js";import"./Link-ChxW31js.js";import"./useResolvedHref-BeosGf4u.js";import"./Tooltip-DtgnmWuT.js";import"./VisuallyHidden-D6rhFrEz.js";import"./Tabs-CQAeqKSM.js";import"./useHasTabbableChild-CODJF7Fc.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
