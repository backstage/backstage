import{be as b,c8 as x,cE as P,bQ as e,c5 as f,w as y}from"./iframe-Bkld27Xv.js";import{P as l}from"./PluginHeader-BD7uPrV0.js";import{C as p}from"./Container-BXRWJb38.js";import{T as t}from"./Text-DqAiXx4f.js";import{B as j}from"./BUIProvider-CZxZ_ya5.js";import"./preload-helper-PPVm8Dsz.js";import"./index--5rDCIj_.js";import"./utils-DEGlt2_H.js";import"./useObjectRef-hOSdhRq8.js";import"./useCollection-hBU3paJt.js";import"./useFocusRing-Sg8Yc6Zc.js";import"./openLink-Dls5t0TL.js";import"./Hidden-CJz8ByQd.js";import"./keyboard-CjcwyYqU.js";import"./FocusScope-Ce-2AlIY.js";import"./useEvent-CEECt1ZX.js";import"./I18nProvider-CcjFgoxB.js";import"./usePress-Bi6q7Yb-.js";import"./textSelection-BI78VxK7.js";import"./useControlledState-BDm5gUq3.js";import"./Link-Ccxf2adh.js";import"./useLink-BTIV2LWq.js";import"./useHover-BTVKyR5u.js";import"./useLocalizedStringFormatter-CyMRJiUd.js";import"./Button-Dq2R9N9l.js";import"./Label-CzzbJTkN.js";import"./useLabel-D1T8LrYx.js";import"./useLabels-DgACLhvG.js";import"./number-CQltgpBt.js";import"./useButton-CPwh7t0a.js";import"./Menu-Daor0sRC.js";import"./Autocomplete-3KAQwcNc.js";import"./getItemCount-Bw7kkJMr.js";import"./Input-CV-w3vcP.js";import"./ListBox-SYkX1TLX.js";import"./Text-BUEI6kbu.js";import"./useListState-BUBg_-f7.js";import"./Dialog-DktLIxy9.js";import"./Heading-BOjVGDqS.js";import"./useOverlayTriggerState-D0ayscvr.js";import"./VisuallyHidden-zbwA2tPm.js";import"./animation-CJ47w7Fx.js";import"./SearchField-ED0xzAc5.js";import"./FieldError-BS9yiOWv.js";import"./useFormValidation-CUV93Bjh.js";import"./useTextField-Bxio2Baz.js";import"./useField-8zpTTKWi.js";import"./useFormReset-CvfhEzlX.js";import"./Virtualizer-CD_PEjGO.js";import"./useFilter-DAeJJSUh.js";import"./getNodeText-Dz75ztpW.js";import"./Link-Cs492X7K.js";import"./useResolvedHref-69pkV9Nv.js";import"./Tooltip-BUUG8-Nl.js";import"./VisuallyHidden-TLeH_xOg.js";import"./Tabs-C4nH8kKZ.js";import"./useHasTabbableChild-CeB76hBD.js";import"./BUIRoutingProvider-kRMOb9Tv.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=f.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...o.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...a.input.parameters?.docs?.source}}};const Se=["Default","WithScrollableContent","WithTabs"];export{o as Default,s as WithScrollableContent,a as WithTabs,Se as __namedExportsOrder};
