import{aN as x,r as b,aO as P,j as e,p as f,M as y}from"./iframe-DvObL_em.js";import{P as l}from"./PluginHeader-DC9BnoK9.js";import{C as p}from"./Container-hb2ZVILX.js";import{T as t}from"./Text-BaU24DSn.js";import{B as j}from"./BUIProvider-AdcJPj66.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D2Zpwq-Q.js";import"./utils-BE29XZkF.js";import"./useObjectRef-DwzLjeGu.js";import"./useCollection-BWKe6rLa.js";import"./useFocusRing-piHZ0Lw1.js";import"./openLink-Ba7f2eDn.js";import"./Hidden-9nwWkQxZ.js";import"./keyboard-yu4clHGi.js";import"./getMetaValue-aV81Iu2D.js";import"./FocusScope-Ctd5mj0p.js";import"./useEvent-PRo-pXvf.js";import"./I18nProvider-D9Ed_WqX.js";import"./usePress-YbeHGM9M.js";import"./textSelection-C86JgNxW.js";import"./useControlledState-DTrBQisE.js";import"./Link-BJsv3MXH.js";import"./useLink-CP-YsS1r.js";import"./useHover-BBinV-uq.js";import"./useLocalizedStringFormatter-CTxy863n.js";import"./Button-BnuV3xvc.js";import"./Label-DVU8J7bE.js";import"./useLabel-Dnkr3wg9.js";import"./useLabels-B4Qm2p4e.js";import"./number-Brjj_L0c.js";import"./useButton-1rnyv_zw.js";import"./Menu-FcIj9KAo.js";import"./Autocomplete-BfbdjnJY.js";import"./useLoadMoreSentinel-CpqtxRDN.js";import"./Input-CDWq18l5.js";import"./ListBox-CW9CuJgQ.js";import"./SelectionIndicator-CfHHXdGx.js";import"./Text-DMNz7_bC.js";import"./useListState-rF97ez7_.js";import"./Dialog-CDF8Z2PM.js";import"./Heading-DTDycEJw.js";import"./useOverlayTriggerState-DTpXlUK_.js";import"./VisuallyHidden-D7cx75l9.js";import"./animation-PoAPtwJr.js";import"./SearchField-DABK_L77.js";import"./FieldError-CKCHKSwJ.js";import"./Form-uDPxvokJ.js";import"./useFormValidation-B7os7M_X.js";import"./useTextField-B17J0BpL.js";import"./useField-XkonZFVV.js";import"./useFormReset-BXzPmcpf.js";import"./Virtualizer-CAPGKCkL.js";import"./useFilter-BK4WEGdM.js";import"./getNodeText-BR6zCbHD.js";import"./Link-DiuD0-rG.js";import"./useResolvedHref-DnRnBf0l.js";import"./Tooltip-Ee6WRrpT.js";import"./VisuallyHidden-Byv6avWM.js";import"./Tabs-D_prVZHS.js";import"./useHasTabbableChild-CXCyofcP.js";import"./BUIRoutingProvider-FkpniH64.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=P(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
