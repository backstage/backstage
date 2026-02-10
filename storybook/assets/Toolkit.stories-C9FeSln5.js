import{j as o}from"./iframe-BDvXWqMv.js";import{c as e}from"./plugin-Z2ZPAbRk.js";import{S as l}from"./Grid-SEE3Vji4.js";import{C as m}from"./ComponentAccordion-DtELa9pk.js";import{w as a}from"./appWrappers-D7GkfUM0.js";import{T as i}from"./TemplateBackstageLogoIcon-CxTNTbfC.js";import{I as s}from"./InfoCard-DuIbSHrf.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-6Gt6crr0.js";import"./componentData-8WYIPpYM.js";import"./useAnalytics-Bhj43Yb4.js";import"./useApp-XW1Y_59p.js";import"./useRouteRef-BNT0Uji7.js";import"./index-CuoyrUh2.js";import"./DialogTitle-DbfnWxYL.js";import"./Modal-aUjOD6G2.js";import"./Portal-Bxsqc2Ff.js";import"./Backdrop-DQKzqBN9.js";import"./Button-D_oOYcjF.js";import"./useObservable-C5WBInFh.js";import"./useIsomorphicLayoutEffect-Ckaa7XZb.js";import"./ExpandMore-D0gsRd1g.js";import"./AccordionDetails-Dl8lH0s0.js";import"./index-B9sM2jn7.js";import"./Collapse-CyX3uF1t.js";import"./useAsync-CZTayVe5.js";import"./useMountedState-DRPCbnV1.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-ByGsH1mf.js";import"./ErrorBoundary-Cmwdx4oo.js";import"./ErrorPanel-DIJrYilU.js";import"./WarningPanel-B6FaAcan.js";import"./MarkdownContent-CH9QtLal.js";import"./CodeSnippet-CRyXuPAV.js";import"./Box-BU77o5ge.js";import"./styled-Dje9scF9.js";import"./CopyTextButton-Bw_MRs6O.js";import"./useCopyToClipboard-CKArlyoH.js";import"./Tooltip-La5U8gro.js";import"./Popper-CBqxIWf4.js";import"./List-BCScUoZK.js";import"./ListContext-BMD4k7rh.js";import"./ListItem-DtJ6NXng.js";import"./ListItemText-BChUSAmp.js";import"./LinkButton-CGPFeLQh.js";import"./Link-OHorDb2O.js";import"./lodash-DTh7qDqK.js";import"./CardHeader-D5WvCsB_.js";import"./Divider-BVTElTLB.js";import"./CardActions-BCLarAT5.js";import"./BottomLink-CnwY1COn.js";import"./ArrowForward-B0ytsCDP.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
