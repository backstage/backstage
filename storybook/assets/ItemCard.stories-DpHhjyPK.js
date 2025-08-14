import{j as e}from"./jsx-runtime-hv06LKfz.js";import{L as m}from"./LinkButton-DYRmglqW.js";import{m as d}from"./makeStyles-CJp8qHqH.js";import{B as p}from"./Box-dSpCvcz2.js";import{c as h}from"./createStyles-Bp4GwXob.js";import{T as s}from"./Typography-NhBf-tfS.js";import{M as u}from"./index-B7KODvs-.js";import{C as g,a as y}from"./CardContent-BgHnYunW.js";import{C as f}from"./CardMedia-DdrWbffI.js";import{C}from"./CardActions-DkGHgpI5.js";import"./index-D8-PC79C.js";import"./Button-aFPoPc-s.js";import"./defaultTheme-NkpNA350.js";import"./capitalize-fS9uM6tv.js";import"./withStyles-BsQ9H3bp.js";import"./hoist-non-react-statics.cjs-DtcWCWp5.js";import"./ButtonBase-DXo3xcpP.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./useIsFocusVisible-BFy7UoKA.js";import"./ownerWindow-CjzjL4wv.js";import"./TransitionGroupContext-CcnbR2YJ.js";import"./Link-m8k68nLc.js";import"./index-DlxYA1zJ.js";import"./lodash-D1GzKnrP.js";import"./typeof-ZI2KZN5z.js";import"./createSvgIcon-Bpme_iea.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-D-gz-Nq7.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-DKhW5xVU.js";import"./useControlled-CliGfT3L.js";import"./unstable_useId-DQJte0g1.js";import"./useApp-BOX1l_wP.js";import"./ApiRef-ByCJBjX1.js";import"./useAnalytics-Q-nz63z2.js";import"./ConfigApi-ij0WO1-Y.js";import"./typography-Mwc_tj4E.js";import"./createStyles-yD3y8ldD.js";import"./Paper-BiLxp0Cg.js";const T=t=>h({root:{color:t.palette.common.white,padding:t.spacing(2,2,3),backgroundImage:t.getPageTheme({themeId:"card"}).backgroundImage,backgroundPosition:0,backgroundSize:"inherit"}}),j=d(T,{name:"BackstageItemCardHeader"});function l(t){const{title:r,subtitle:a,children:n}=t,b=j(t);return e.jsxs(p,{className:b.root,children:[a&&e.jsx(s,{variant:"subtitle2",component:"h3",children:a}),r&&e.jsx(s,{variant:"h6",component:"h4",children:r}),n]})}l.__docgenInfo={description:`A simple card header, rendering a default look for "item cards" - cards that
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
those.`}}};const k=t=>h({root:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(22em, 1fr))",gridAutoRows:"1fr",gridGap:t.spacing(2)}}),I=d(k,{name:"BackstageItemCardGrid"});function c(t){const{children:r,...a}=t,n=I(a);return e.jsx(p,{className:n.root,...a,children:r})}c.__docgenInfo={description:`A default grid to use when arranging "item cards" - cards that let users
select among several options.

@remarks
The immediate children are expected to be Material UI Card components.

Styles for the grid can be overridden using the \`classes\` prop, e.g.:

\`<ItemCardGrid title="Hello" classes={{ root: myClassName }} />\`

This can be useful for e.g. overriding gridTemplateColumns to adapt the
minimum size of the cells to fit the content better.

@public`,methods:[],displayName:"ItemCardGrid",props:{children:{required:!1,tsType:{name:"ReactNode"},description:"The Card items of the grid."}}};const pe={title:"Layout/Item Cards"},x="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",w=d({grid:{gridTemplateColumns:"repeat(auto-fill, 12em)"},header:{color:"black",backgroundImage:"linear-gradient(to bottom right, red, yellow)"}}),o=()=>e.jsxs(u,{children:[e.jsx(s,{paragraph:!0,children:"The most basic setup is to place a bunch of cards into a large grid, leaving styling to the defaults. Try to resize the window to see how they rearrange themselves to fit the viewport."}),e.jsx(c,{children:[...Array(10).keys()].map(t=>e.jsxs(g,{children:[e.jsx(f,{children:e.jsx(l,{title:`Card #${t}`,subtitle:"Subtitle"})}),e.jsx(y,{children:x.split(" ").slice(0,5+Math.floor(Math.random()*30)).join(" ")}),e.jsx(C,{children:e.jsx(m,{color:"primary",to:"/catalog",children:"Go There!"})})]},t))})]}),i=()=>{const t=w();return e.jsxs(u,{children:[e.jsxs(s,{paragraph:!0,children:["Both the grid and the header can be styled, using the"," ",e.jsx(s,{variant:"caption",children:"classes"})," property. This lets you for example tweak the column sizes and the background of the header."]}),e.jsx(c,{classes:{root:t.grid},children:[...Array(10).keys()].map(r=>e.jsxs(g,{children:[e.jsx(f,{children:e.jsx(l,{title:`Card #${r}`,subtitle:"Subtitle",classes:{root:t.header}})}),e.jsx(y,{children:x.split(" ").slice(0,5+Math.floor(Math.random()*30)).join(" ")}),e.jsx(C,{children:e.jsx(m,{color:"primary",to:"/catalog",children:"Go There!"})})]},r))})]})};o.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Styling"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => <MemoryRouter>
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
  </MemoryRouter>`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};const he=["Default","Styling"];export{o as Default,i as Styling,he as __namedExportsOrder,pe as default};
