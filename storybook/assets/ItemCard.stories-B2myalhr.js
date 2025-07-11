import{j as e}from"./jsx-runtime-Cw0GR0a5.js";import{L as f}from"./LinkButton-DhIs5zOZ.js";import{m as d}from"./makeStyles-3WuthtJ7.js";import{B as C}from"./Box-BZcLdGyY.js";import{c as x}from"./createStyles-Bp4GwXob.js";import{T as s}from"./Typography-CUBppVl0.js";import{M as b}from"./index-w6SBqnNd.js";import{C as T,a as j}from"./CardContent-7S1EI-5r.js";import{C as k}from"./CardMedia-DdRny_FX.js";import{C as I}from"./CardActions-B1gbxntd.js";import"./index-CTjT7uj6.js";import"./Link-Bp-Lt7-P.js";import"./index-Cqve-NHl.js";import"./lodash-CoGan1YB.js";import"./index-DwHHXP4W.js";import"./interopRequireDefault-Y9pwbXtE.js";import"./createSvgIcon-rCELOQ8q.js";import"./capitalize-CjHL08xv.js";import"./defaultTheme-U8IXQtr7.js";import"./withStyles-Dj_puyu8.js";import"./hoist-non-react-statics.cjs-DzIEFHQI.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-CAWH9WqG.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-B_4ddUuK.js";import"./ownerWindow-C3iVrxHF.js";import"./useIsFocusVisible-BQk2_Vhe.js";import"./useControlled-B47E2WMp.js";import"./unstable_useId-B3Hiq1YI.js";import"./useAnalytics-DVyBXs_0.js";import"./ApiRef-CqkoWjZn.js";import"./ConfigApi-D1qiBdfc.js";import"./Button-Cwg5hjTf.js";import"./ButtonBase-C1iu_4vV.js";import"./TransitionGroupContext-BtzQ-Cv7.js";import"./typography-hVTC7Hfk.js";import"./createStyles-yD3y8ldD.js";import"./Paper-BZKq1osr.js";const M=t=>x({root:{color:t.palette.common.white,padding:t.spacing(2,2,3),backgroundImage:t.getPageTheme({themeId:"card"}).backgroundImage,backgroundPosition:0,backgroundSize:"inherit"}}),S=d(M,{name:"BackstageItemCardHeader"});function l(t){const{title:r,subtitle:a,children:n}=t,v=S(t);return e.jsxs(C,{className:v.root,children:[a&&e.jsx(s,{variant:"subtitle2",component:"h3",children:a}),r&&e.jsx(s,{variant:"h6",component:"h4",children:r}),n]})}l.__docgenInfo={description:`A simple card header, rendering a default look for "item cards" - cards that
are arranged in a grid for users to select among several options.

@remarks
This component expects to be placed within a Material UI \`<CardMedia>\`.

Styles for the header can be overridden using the \`classes\` prop, e.g.:

\`<ItemCardHeader title="Hello" classes={{ root: myClassName }} />\`

@public`,methods:[],displayName:"ItemCardHeader",props:{title:{required:!1,tsType:{name:"ReactNode"},description:`A large title to show in the header, providing the main heading.

Use this if you want to have the default styling and placement of a title.`},subtitle:{required:!1,tsType:{name:"ReactNode"},description:`A slightly smaller title to show in the header, providing additional
details.

Use this if you want to have the default styling and placement of a
subtitle.`},children:{required:!1,tsType:{name:"ReactNode"},description:`Custom children to draw in the header.

If the title and/or subtitle were specified, the children are drawn below
those.`}}};const A=t=>x({root:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(22em, 1fr))",gridAutoRows:"1fr",gridGap:t.spacing(2)}}),G=d(A,{name:"BackstageItemCardGrid"});function c(t){const{children:r,...a}=t,n=G(a);return e.jsx(C,{className:n.root,...a,children:r})}c.__docgenInfo={description:`A default grid to use when arranging "item cards" - cards that let users
select among several options.

@remarks
The immediate children are expected to be Material UI Card components.

Styles for the grid can be overridden using the \`classes\` prop, e.g.:

\`<ItemCardGrid title="Hello" classes={{ root: myClassName }} />\`

This can be useful for e.g. overriding gridTemplateColumns to adapt the
minimum size of the cells to fit the content better.

@public`,methods:[],displayName:"ItemCardGrid",props:{children:{required:!1,tsType:{name:"ReactNode"},description:"The Card items of the grid."}}};const ye={title:"Layout/Item Cards"},w="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",N=d({grid:{gridTemplateColumns:"repeat(auto-fill, 12em)"},header:{color:"black",backgroundImage:"linear-gradient(to bottom right, red, yellow)"}}),o=()=>e.jsxs(b,{children:[e.jsx(s,{paragraph:!0,children:"The most basic setup is to place a bunch of cards into a large grid, leaving styling to the defaults. Try to resize the window to see how they rearrange themselves to fit the viewport."}),e.jsx(c,{children:[...Array(10).keys()].map(t=>e.jsxs(T,{children:[e.jsx(k,{children:e.jsx(l,{title:`Card #${t}`,subtitle:"Subtitle"})}),e.jsx(j,{children:w.split(" ").slice(0,5+Math.floor(Math.random()*30)).join(" ")}),e.jsx(I,{children:e.jsx(f,{color:"primary",to:"/catalog",children:"Go There!"})})]},t))})]}),i=()=>{const t=N();return e.jsxs(b,{children:[e.jsxs(s,{paragraph:!0,children:["Both the grid and the header can be styled, using the"," ",e.jsx(s,{variant:"caption",children:"classes"})," property. This lets you for example tweak the column sizes and the background of the header."]}),e.jsx(c,{classes:{root:t.grid},children:[...Array(10).keys()].map(r=>e.jsxs(T,{children:[e.jsx(k,{children:e.jsx(l,{title:`Card #${r}`,subtitle:"Subtitle",classes:{root:t.header}})}),e.jsx(j,{children:w.split(" ").slice(0,5+Math.floor(Math.random()*30)).join(" ")}),e.jsx(I,{children:e.jsx(f,{color:"primary",to:"/catalog",children:"Go There!"})})]},r))})]})};o.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Styling"};var m,p,h;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`() => <MemoryRouter>
    <Typography paragraph>
      The most basic setup is to place a bunch of cards into a large grid,
      leaving styling to the defaults. Try to resize the window to see how they
      rearrange themselves to fit the viewport.
    </Typography>
    <ItemCardGrid>
      {[...Array(10).keys()].map(index => <Card key={index}>
          <CardMedia>
            <ItemCardHeader title={\`Card #\${index}\`} subtitle="Subtitle" />
          </CardMedia>
          <CardContent>
            {text.split(' ').slice(0, 5 + Math.floor(Math.random() * 30)).join(' ')}
          </CardContent>
          <CardActions>
            <LinkButton color="primary" to="/catalog">
              Go There!
            </LinkButton>
          </CardActions>
        </Card>)}
    </ItemCardGrid>
  </MemoryRouter>`,...(h=(p=o.parameters)==null?void 0:p.docs)==null?void 0:h.source}}};var u,g,y;i.parameters={...i.parameters,docs:{...(u=i.parameters)==null?void 0:u.docs,source:{originalSource:`() => {
  const classes = useStyles();
  return <MemoryRouter>
      <Typography paragraph>
        Both the grid and the header can be styled, using the{' '}
        <Typography variant="caption">classes</Typography> property. This lets
        you for example tweak the column sizes and the background of the header.
      </Typography>
      <ItemCardGrid classes={{
      root: classes.grid
    }}>
        {[...Array(10).keys()].map(index => <Card key={index}>
            <CardMedia>
              <ItemCardHeader title={\`Card #\${index}\`} subtitle="Subtitle" classes={{
            root: classes.header
          }} />
            </CardMedia>
            <CardContent>
              {text.split(' ').slice(0, 5 + Math.floor(Math.random() * 30)).join(' ')}
            </CardContent>
            <CardActions>
              <LinkButton color="primary" to="/catalog">
                Go There!
              </LinkButton>
            </CardActions>
          </Card>)}
      </ItemCardGrid>
    </MemoryRouter>;
}`,...(y=(g=i.parameters)==null?void 0:g.docs)==null?void 0:y.source}}};const fe=["Default","Styling"];export{o as Default,i as Styling,fe as __namedExportsOrder,ye as default};
