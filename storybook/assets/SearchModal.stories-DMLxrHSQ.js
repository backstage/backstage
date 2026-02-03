import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-CqNqnb74.js";import{r as x}from"./plugin-B4vq7brV.js";import{S as l,u as c,a as S}from"./useSearchModal-CMLwg1p5.js";import{s as M,M as C}from"./api-CXOWMhx8.js";import{S as f}from"./SearchContext-P9AU12Mh.js";import{B as m}from"./Button-BIN6mxNu.js";import{D as j,a as y,b as B}from"./DialogTitle-CooOy-k1.js";import{B as D}from"./Box-BOvD5Bg7.js";import{S as n}from"./Grid-Caq84KkR.js";import{S as I}from"./SearchType-CL46Ygwr.js";import{L as G}from"./List-aEU9IVP1.js";import{H as R}from"./DefaultResultListItem-2qcRC-ch.js";import{w as k}from"./appWrappers-C_psOORT.js";import{SearchBar as v}from"./SearchBar-B6e27TV5.js";import{S as T}from"./SearchResult-Dw9GFPJ4.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BtY4FWww.js";import"./Plugin-DYku7kmG.js";import"./componentData-FAAyaxJE.js";import"./useAnalytics-BT9M_UlL.js";import"./useApp-IKd96EAr.js";import"./useRouteRef-C3TAPCF-.js";import"./index-CfXjUdjY.js";import"./ArrowForward-PIPGF8mw.js";import"./translation-BzwFgS-T.js";import"./Page-CA2E0pO2.js";import"./useMediaQuery-CWqszbU7.js";import"./Divider-zsbty3yZ.js";import"./ArrowBackIos-BRaZW9s_.js";import"./ArrowForwardIos-9LEawdk7.js";import"./translation-6sGwMjdp.js";import"./lodash-Czox7iJy.js";import"./useAsync-BA3GFE0D.js";import"./useMountedState-DTFeLOhk.js";import"./Modal-DG_DwVZd.js";import"./Portal-Czxz0PR0.js";import"./Backdrop-Bu5rdiX9.js";import"./styled-_PBYdDbi.js";import"./ExpandMore-CaaJdVfs.js";import"./AccordionDetails-DNjlLobr.js";import"./index-B9sM2jn7.js";import"./Collapse-D1DbSfAq.js";import"./ListItem-CO20Ch0Y.js";import"./ListContext-D4KOPpIf.js";import"./ListItemIcon-C8cTKLJJ.js";import"./ListItemText-qCutXsPN.js";import"./Tabs-qh5ktSop.js";import"./KeyboardArrowRight-Cz0MIfB9.js";import"./FormLabel-BxMS29fA.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CQP7uyEk.js";import"./InputLabel-5MMsDpHu.js";import"./Select-Drfh7cOi.js";import"./Popover-B5zxDxZ5.js";import"./MenuItem-H50HeRw-.js";import"./Checkbox-DnX_3FvA.js";import"./SwitchBase-DcL340rk.js";import"./Chip-CQSxYnZr.js";import"./Link-CAxa2nmx.js";import"./useObservable-BIXBQOil.js";import"./useIsomorphicLayoutEffect-BPmaJ8UY.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BEjx83JW.js";import"./useDebounce-DXvEewVU.js";import"./InputAdornment-D-pzShuv.js";import"./TextField-QU-eiiFA.js";import"./useElementFilter-BOSDyS7s.js";import"./EmptyState-DkzQrd7L.js";import"./Progress-CcbDmCr8.js";import"./LinearProgress-DbLVB4oe.js";import"./ResponseErrorPanel-PcbzMDq5.js";import"./ErrorPanel-BYm0Mdkb.js";import"./WarningPanel-BCw9VL3x.js";import"./MarkdownContent-CAUU14sj.js";import"./CodeSnippet-DP3MYkIR.js";import"./CopyTextButton-DzB5MTRG.js";import"./useCopyToClipboard-D6T0fjGN.js";import"./Tooltip-DFfl-fad.js";import"./Popper-C4CcENfH.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>
  );
};
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const CustomModal = () => {
  const classes = useStyles();
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => (
          <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs
                    defaultValue=""
                    types={[
                      {
                        value: "custom-result-item",
                        name: "Custom Item",
                      },
                      {
                        value: "no-custom-result-item",
                        name: "No Custom Item",
                      },
                    ]}
                  />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({ results }) => (
                      <List>
                        {results.map(({ document }) => (
                          <div
                            role="button"
                            tabIndex={0}
                            key={\`\${document.location}-btn\`}
                            onClick={toggleModal}
                            onKeyPress={toggleModal}
                          >
                            <DefaultResultListItem
                              key={document.location}
                              result={document}
                            />
                          </div>
                        ))}
                      </List>
                    )}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>
        )}
      </SearchModal>
    </>
  );
};
`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...r.parameters?.docs?.source}}};const io=["Default","CustomModal"];export{r as CustomModal,e as Default,io as __namedExportsOrder,so as default};
