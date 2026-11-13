import{aD as x,r as b,aE as f,j as e,p as P}from"./iframe-a5iorYt_.js";import{T as y}from"./TestRouter--PYm8d_Y.js";import{P as l}from"./PluginHeader-DCpCADPq.js";import{C as p}from"./Container-OIlGTD92.js";import{T as t}from"./Text-C9wqzkPi.js";import{B as j}from"./BUIProvider-CnPnbG6C.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CIXpXNvI.js";import"./index-DmAgGD7M.js";import"./utils-CKuAz2Wi.js";import"./useObjectRef-DomNprMl.js";import"./useCollection-BBpc6g4m.js";import"./useFocusRing-BW-GobYG.js";import"./Hidden-Bu-9bwhW.js";import"./keyboard-D4TVu98T.js";import"./getMetaValue-BDmRRgum.js";import"./FocusScope-RWMZe2T0.js";import"./useEvent-CWwVnFif.js";import"./I18nProvider-Cha0UYwj.js";import"./usePress-BUjc0uWv.js";import"./textSelection-C8mzHD_X.js";import"./useControlledState-x1Vpl6eH.js";import"./Link-C1zSXtQt.js";import"./useLink-yQNKe3PO.js";import"./useHover-D7-ycX7p.js";import"./useLocalizedStringFormatter-CEuruQsY.js";import"./Button-DH0afYUU.js";import"./Label-Orfe5toA.js";import"./useLabel-Bgchr9R9.js";import"./useLabels-BoVBLTQ5.js";import"./number-Ccp2yLIm.js";import"./useButton-6YfvAB0s.js";import"./Menu-D1TPLtyB.js";import"./Autocomplete-C-CgF1zY.js";import"./useLoadMoreSentinel-CoFFNPV0.js";import"./Input-CaBktYIq.js";import"./ListBox-3Ml5ELOg.js";import"./SelectionIndicator-zgWFy5d3.js";import"./Text-BzXkZD1r.js";import"./useListState-2CE38nHg.js";import"./Dialog-BAw8KcVJ.js";import"./Heading-BX-j4_Ff.js";import"./useOverlayTriggerState-oc_4bf5x.js";import"./VisuallyHidden-Bfh8sdi2.js";import"./animation-CocdaLDQ.js";import"./SearchField-nz3tdmNL.js";import"./FieldError-BwiCreHd.js";import"./Form-9OpxVQln.js";import"./useFormValidation-S2CY6qm2.js";import"./useTextField-BDxLzRUI.js";import"./useField-DZ_E8vUK.js";import"./useFormReset-CbHbRAHO.js";import"./Virtualizer-Dmp61e7Y.js";import"./useFilter-Cfq7ZC3o.js";import"./getNodeText-CzPV5887.js";import"./BUIRoutingProvider-B91F5UQb.js";import"./Link-BhR2cPFk.js";import"./Tooltip-Dhxyt2Bc.js";import"./VisuallyHidden-B8krgRIp.js";import"./Tabs-DMBhag34.js";import"./useHasTabbableChild-CaO7qaSg.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=f(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=P.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};const qe=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,qe as __namedExportsOrder};
