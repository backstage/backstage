import{aO as x,r as b,aP as P,j as e,p as f,M as y}from"./iframe-B3Qnvxa_.js";import{P as l}from"./PluginHeader-CLZ0ejRz.js";import{C as p}from"./Container-D7vrSDnz.js";import{T as t}from"./Text-DZgbuz4B.js";import{B as j}from"./BUIProvider-CVZylF-T.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CymDSTkJ.js";import"./utils-If5ksnAe.js";import"./useObjectRef-BLUGjhTS.js";import"./useCollection-C0KWGunX.js";import"./useFocusRing-kY9ZCJul.js";import"./openLink-DUBrf5Vo.js";import"./Hidden-D0v5Fd-T.js";import"./keyboard-DErvBxra.js";import"./getMetaValue-Bfb9dALM.js";import"./FocusScope-COFxSTVI.js";import"./useEvent-DvzpAe6X.js";import"./I18nProvider-w0p5O94b.js";import"./usePress-DS_kkfX7.js";import"./textSelection-C-KNkP-o.js";import"./useControlledState-Bz4IB1Ec.js";import"./Link-CsQQiegi.js";import"./useLink-CBQBGD2X.js";import"./useHover-CMuPDAG4.js";import"./useLocalizedStringFormatter-BYLeamaS.js";import"./Button-D7TKPyRW.js";import"./Label-Z8qmlos3.js";import"./useLabel-DtpxzJ5z.js";import"./useLabels-bYYWYrus.js";import"./number-IY6oxrwY.js";import"./useButton-D8THw0ar.js";import"./Menu-DJO9UFWe.js";import"./Autocomplete-CqjB4B8R.js";import"./useLoadMoreSentinel-CZYOzpuH.js";import"./Input-BTZAGOQr.js";import"./ListBox-Xc-PGKLs.js";import"./SelectionIndicator-DAMG82yw.js";import"./Text-BFgsjRxI.js";import"./useListState-0SZ5kgRY.js";import"./Dialog-BgTJWZyb.js";import"./Heading-Dmx8fNyM.js";import"./useOverlayTriggerState-eGmwqTEM.js";import"./VisuallyHidden-ctIVpEsZ.js";import"./animation-zPNoS82u.js";import"./SearchField-cSWY-1nh.js";import"./FieldError-2zCs0NXy.js";import"./Form-CqKyLLrG.js";import"./useFormValidation-BKFLE_er.js";import"./useTextField-4reRhcvW.js";import"./useField-DGm2TnJi.js";import"./useFormReset-B6lNLtFj.js";import"./Virtualizer-rr3cS-4r.js";import"./useFilter-BtlnkUu9.js";import"./getNodeText-CJGyICvp.js";import"./Link-BvVgllqP.js";import"./useResolvedHref-BHZgPwt2.js";import"./Tooltip-D2IZ3a6Y.js";import"./VisuallyHidden-r8UgBnyv.js";import"./Tabs-BFDyd00K.js";import"./useHasTabbableChild-4JC9qncS.js";import"./BUIRoutingProvider-CBiNhqBQ.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=P(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
