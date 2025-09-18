import{j as o}from"./iframe-COb0l9Ot.js";import{c as e}from"./plugin-BF5haQ0y.js";import{S as l}from"./Grid-YEqTPm11.js";import{C as m}from"./ComponentAccordion-7HeQh8wy.js";import{w as a}from"./appWrappers-CUP1_xOq.js";import{T as i}from"./TemplateBackstageLogoIcon-DwgFa1Pg.js";import{I as s}from"./InfoCard-D7qgUOA3.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-d8SAvW_D.js";import"./componentData-BMcw6RgA.js";import"./useAnalytics-BEClZYF1.js";import"./useApp-DOIE3BzV.js";import"./useRouteRef-B3C5BO0J.js";import"./index-C2rNmFdC.js";import"./DialogTitle-B1Fp7DaC.js";import"./Modal-Da3_mpt5.js";import"./Portal-DhkyDrOm.js";import"./Backdrop-DvB5sMhK.js";import"./Button-2GtkzPEz.js";import"./useObservable-GPFeSMKQ.js";import"./ExpandMore-DzIoUaMP.js";import"./AccordionDetails-xHtvINQ6.js";import"./index-DnL3XN75.js";import"./Collapse-DKLG8K48.js";import"./useAsync-Ove48rSA.js";import"./useMountedState-BCYouEnX.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-Dv8QIF22.js";import"./ErrorBoundary-DODDDLR0.js";import"./ErrorPanel-BXUGmJvH.js";import"./WarningPanel-CNUUwcSO.js";import"./MarkdownContent-DWCHMYxR.js";import"./CodeSnippet-DUq6zHFn.js";import"./Box-DdeU9hBZ.js";import"./styled-COzJBZos.js";import"./CopyTextButton-L7Y3IiwS.js";import"./useCopyToClipboard-Bc2Muk56.js";import"./Tooltip-DiHf9MQ-.js";import"./Popper-Jg-KIdHc.js";import"./List-C_SD4FZR.js";import"./ListContext-C2fYDrJh.js";import"./ListItem-BXV5PRVp.js";import"./ListItemText-Cpgtr8oy.js";import"./LinkButton-CXB10pz2.js";import"./Link-Ct1evR27.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-Bx-1HdmL.js";import"./Divider-DBtusLcX.js";import"./CardActions-DeYkfajh.js";import"./BottomLink-LHhWavGh.js";import"./ArrowForward-BIQnZ3Mi.js";const so={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
}`,...t.parameters?.docs?.source}}};const co=["Default","InAccordion"];export{r as Default,t as InAccordion,co as __namedExportsOrder,so as default};
