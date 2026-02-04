import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-D7hFsAHh.js";import{r as x}from"./plugin-BnCxuXN9.js";import{S as l,u as c,a as S}from"./useSearchModal-Bsss3qPh.js";import{s as M,M as C}from"./api-Du5KuwVt.js";import{S as f}from"./SearchContext-w4Vv18Zz.js";import{B as m}from"./Button-Qm72mdor.js";import{D as j,a as y,b as B}from"./DialogTitle-I9jy4wXP.js";import{B as D}from"./Box-D-wD6_7y.js";import{S as n}from"./Grid-BBTPNutj.js";import{S as I}from"./SearchType-CKPYDCd_.js";import{L as G}from"./List-CIMPRI7k.js";import{H as R}from"./DefaultResultListItem-BiAt7xVl.js";import{w as k}from"./appWrappers-BPgQm-7I.js";import{SearchBar as v}from"./SearchBar-CjTnTioA.js";import{S as T}from"./SearchResult-B0PWM9O1.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Cl21dMT5.js";import"./Plugin-BOlTNLJ_.js";import"./componentData-B0-3b838.js";import"./useAnalytics-DEh4mfg6.js";import"./useApp-DH_b7x7P.js";import"./useRouteRef-BuKO7_g7.js";import"./index-CMWiNJrn.js";import"./ArrowForward-B95Ii3a7.js";import"./translation-B3g83s7Y.js";import"./Page-Cvd6bNYg.js";import"./useMediaQuery-DY2CsapC.js";import"./Divider-DMcnu_lF.js";import"./ArrowBackIos-ZCXsphLD.js";import"./ArrowForwardIos-Cix9cCNB.js";import"./translation-7xkuNGlo.js";import"./lodash-Czox7iJy.js";import"./useAsync-BELltm9_.js";import"./useMountedState-jyZ6jmpg.js";import"./Modal-DMtGtm-r.js";import"./Portal-8ZiP_Sqy.js";import"./Backdrop-DxPYSkiX.js";import"./styled-CbYuIyxW.js";import"./ExpandMore-e5K7_2D4.js";import"./AccordionDetails-Bs_9tEgl.js";import"./index-B9sM2jn7.js";import"./Collapse-CX1fKFyZ.js";import"./ListItem-CLTebMeN.js";import"./ListContext-D0CqRlfT.js";import"./ListItemIcon-t4hoQgwL.js";import"./ListItemText-Ben4oQC7.js";import"./Tabs-CuKorXpg.js";import"./KeyboardArrowRight-JBZv3G3c.js";import"./FormLabel-Kvx0IeMI.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DH6pr2fB.js";import"./InputLabel-Bh61Z7PY.js";import"./Select-BGPogxnk.js";import"./Popover-C2DlR72c.js";import"./MenuItem-CaxntCGS.js";import"./Checkbox-pWxfG2Ld.js";import"./SwitchBase-CSzMojel.js";import"./Chip-B8GHUEw4.js";import"./Link-JoAHle2P.js";import"./useObservable-CtiHHxxM.js";import"./useIsomorphicLayoutEffect-CtVE3GbE.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-Bxt5ZgBZ.js";import"./useDebounce-Cug-sk9G.js";import"./InputAdornment-CuWyu_i6.js";import"./TextField-Coin4HKY.js";import"./useElementFilter-D9cvIr06.js";import"./EmptyState-LVoxvT0K.js";import"./Progress-pO2tBfa7.js";import"./LinearProgress-ooEivR1u.js";import"./ResponseErrorPanel-CPtvEkTP.js";import"./ErrorPanel-REZtkXZm.js";import"./WarningPanel-BXBOJrST.js";import"./MarkdownContent-lDWK0lAQ.js";import"./CodeSnippet-DfGrFjGG.js";import"./CopyTextButton-NjimjsMr.js";import"./useCopyToClipboard-CaZKc_Tm.js";import"./Tooltip-5tHvVIiB.js";import"./Popper-DQ1szM6i.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
