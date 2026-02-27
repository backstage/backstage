import{j as t,Z as u,N as p,$ as g}from"./iframe-CAn0lpb7.js";import{r as h}from"./plugin-DbdlnBnO.js";import{S as l,u as c,a as x}from"./useSearchModal-BxW5k9Bs.js";import{s as S,M}from"./api-B5UduJ3O.js";import{S as C}from"./SearchContext-BoXPuaA_.js";import{B as m}from"./Button-CQLXImZi.js";import{m as f}from"./makeStyles-DYHcJhPK.js";import{D as j,a as y,b as B}from"./DialogTitle-zZ3j__Y8.js";import{B as D}from"./Box-Bjf2DMwk.js";import{S as n}from"./Grid-YTZOmRBF.js";import{S as I}from"./SearchType-CBIEBuq8.js";import{L as G}from"./List-D_KByg89.js";import{H as R}from"./DefaultResultListItem-Dghakn5V.js";import{w as k}from"./appWrappers-Cq9N-ap8.js";import{SearchBar as v}from"./SearchBar-BZLkQnoz.js";import{S as T}from"./SearchResult-C-y_fNsm.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CiP8aU0a.js";import"./Plugin-CSvU67SI.js";import"./componentData-cLjpkNpS.js";import"./useAnalytics-Bzn9D7Qs.js";import"./useApp-DuNmaME_.js";import"./useRouteRef-Bg2JjxFx.js";import"./index-DUzhWtMs.js";import"./ArrowForward-BwLRCg8m.js";import"./translation-Dw2ub4N6.js";import"./Page-CIaIxrYu.js";import"./useMediaQuery-0wr5iEG9.js";import"./Divider-BIPsYmmT.js";import"./ArrowBackIos-DtGYQxhX.js";import"./ArrowForwardIos-DQ7plIQb.js";import"./translation-BCshPLHi.js";import"./lodash-BrFkqfO4.js";import"./useAsync-B4fykCm9.js";import"./useMountedState-CX5z9T7u.js";import"./Modal-C19m3_iM.js";import"./Portal-BzlmyQcI.js";import"./Backdrop-DGk48PRG.js";import"./styled-D2e0uBXe.js";import"./ExpandMore-xICNXpG1.js";import"./AccordionDetails-_HyDmEav.js";import"./index-B9sM2jn7.js";import"./Collapse-CGSHL87p.js";import"./ListItem-ri7MtAQ3.js";import"./ListContext-CK2zO4S5.js";import"./ListItemIcon-Bdaj1neG.js";import"./ListItemText-CSTbdY-P.js";import"./Tabs-JmzoOjgQ.js";import"./KeyboardArrowRight-BFykl3e0.js";import"./FormLabel-D7dkmV1_.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DI_tDND_.js";import"./InputLabel-DmswVdXi.js";import"./Select-8wdS7IRx.js";import"./Popover-C55NQtKe.js";import"./MenuItem-4hxE0cYb.js";import"./Checkbox-Z1YAMzhE.js";import"./SwitchBase-GtekAhlM.js";import"./Chip-Br5mKNNF.js";import"./Link-CDRYLymQ.js";import"./index-DUopTZr9.js";import"./useObservable-o57buXpg.js";import"./useIsomorphicLayoutEffect-DLvkk_u6.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-DWffEwY2.js";import"./useDebounce-C3gqlKES.js";import"./InputAdornment-CZ1YC5pk.js";import"./TextField-CA9Buhjk.js";import"./useElementFilter-DApNiM9i.js";import"./EmptyState-C06-U8yx.js";import"./Progress-Cb_wu6VS.js";import"./LinearProgress-Beb0K_qE.js";import"./ResponseErrorPanel-CUIVIBem.js";import"./ErrorPanel-dJStxzKK.js";import"./WarningPanel-Cj6whWD2.js";import"./MarkdownContent-BL82eX4x.js";import"./CodeSnippet-g0Bf0_yA.js";import"./CopyTextButton-QWCPLp9Y.js";import"./useCopyToClipboard-C1STrRey.js";import"./Tooltip-ofHGhymy.js";import"./Popper-CTfH6WVF.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
}`,...r.parameters?.docs?.source}}};const co=["Default","CustomModal"];export{r as CustomModal,e as Default,co as __namedExportsOrder,lo as default};
