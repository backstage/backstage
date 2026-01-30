import{j as o}from"./iframe-BdfNw3Ub.js";import{c as e}from"./plugin-CVG9qekJ.js";import{S as l}from"./Grid-ClCC6X0d.js";import{C as m}from"./ComponentAccordion-JcqGMha0.js";import{w as a}from"./appWrappers-DY8qCh6j.js";import{T as i}from"./TemplateBackstageLogoIcon-BCpoer98.js";import{I as s}from"./InfoCard-Dkf7Vofo.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CIPiPeTO.js";import"./componentData-Bbvl56dJ.js";import"./useAnalytics-CIau1Q_f.js";import"./useApp-CClJ7qR8.js";import"./useRouteRef-alWxSySK.js";import"./index-DGTjwYkT.js";import"./DialogTitle-DI-aEKjw.js";import"./Modal-DSvl6f6m.js";import"./Portal-CuRfOwRS.js";import"./Backdrop-NgNpouL3.js";import"./Button-B1NvJhKb.js";import"./useObservable-CIl4-77m.js";import"./useIsomorphicLayoutEffect-C0bErC-3.js";import"./ExpandMore-dcQwlkUA.js";import"./AccordionDetails-CPLXq-Rf.js";import"./index-B9sM2jn7.js";import"./Collapse-DwRSSlvv.js";import"./useAsync-DF3--aFh.js";import"./useMountedState-B5cOerk8.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-Bx1WafIg.js";import"./ErrorBoundary-CvPyv2ZJ.js";import"./ErrorPanel-NKrLmxAy.js";import"./WarningPanel-Bslmfj1Q.js";import"./MarkdownContent-B84ymYDA.js";import"./CodeSnippet-DtZ5NGdI.js";import"./Box-Ck7a0B2s.js";import"./styled-BblI00As.js";import"./CopyTextButton-DDSW1go4.js";import"./useCopyToClipboard-CQmr7kQ1.js";import"./Tooltip-LFPLy9FS.js";import"./Popper-CW4DzWu0.js";import"./List-Be-141Yt.js";import"./ListContext-C0BE_woo.js";import"./ListItem-eROPvDGl.js";import"./ListItemText-Cap62zTH.js";import"./LinkButton-CSUtAD8o.js";import"./Link-CYv59bNI.js";import"./lodash-Czox7iJy.js";import"./CardHeader-Blm8M5ME.js";import"./Divider--Mq8jTWg.js";import"./CardActions-AkNSsw6_.js";import"./BottomLink-BnpEOv8_.js";import"./ArrowForward-C7IoLyo6.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <Grid item xs={12} md={6}>
      <HomePageToolkit tools={Array(8).fill({
      url: '#',
      label: 'link',
      icon: <TemplateBackstageLogoIcon />
    })} />
    </Grid>;
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  const ExpandedComponentAccordion = (props: any) => <ComponentAccordion expanded {...props} />;
  return <InfoCard title="Toolkit" noPadding>
      <Grid item>
        <HomePageToolkit title="Tools 1" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ExpandedComponentAccordion} />
        <HomePageToolkit title="Tools 2" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
        <HomePageToolkit title="Tools 3" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
      </Grid>
    </InfoCard>;
}`,...t.parameters?.docs?.source}}};const uo=["Default","InAccordion"];export{r as Default,t as InAccordion,uo as __namedExportsOrder,co as default};
