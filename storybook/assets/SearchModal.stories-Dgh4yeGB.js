import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-q37i5wh7.js";import{r as x}from"./plugin-i1h9CgYk.js";import{S as l,u as c,a as S}from"./useSearchModal-HM7TGGuk.js";import{s as M,M as C}from"./api-BxIuVTwn.js";import{S as f}from"./SearchContext-D24n4Ehu.js";import{B as m}from"./Button-DPiRNZXm.js";import{D as j,a as y,b as B}from"./DialogTitle-CtRkS27u.js";import{B as D}from"./Box-COPOq1Uf.js";import{S as n}from"./Grid-C05v6eeb.js";import{S as I}from"./SearchType-u0hVRoxA.js";import{L as G}from"./List-PIZxoj_p.js";import{H as R}from"./DefaultResultListItem-DOh_86PH.js";import{w as k}from"./appWrappers-COl_vAr6.js";import{SearchBar as v}from"./SearchBar-149t-uDM.js";import{S as T}from"./SearchResult-CuvSv85z.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CyHPEJ-Q.js";import"./Plugin-CB9fW_xb.js";import"./componentData-E9OYffVp.js";import"./useAnalytics-Qh0Z6cDc.js";import"./useApp-DRQlf20V.js";import"./useRouteRef-Dm0QmNOs.js";import"./index-4QSZcc7K.js";import"./ArrowForward-Bjdstcjo.js";import"./translation-BRViy-pc.js";import"./Page-BRerolZJ.js";import"./useMediaQuery-Ds3LtY7a.js";import"./Divider-DMqMfewh.js";import"./ArrowBackIos-DwRCXZn9.js";import"./ArrowForwardIos-m1VYIkAM.js";import"./translation-MnKVujKE.js";import"./lodash-Czox7iJy.js";import"./useAsync-5U-iBZk2.js";import"./useMountedState-rIY5swUn.js";import"./Modal-TMOxKW-w.js";import"./Portal-Cg2yUny5.js";import"./Backdrop-CWK59iWf.js";import"./styled-Cr1yRHHC.js";import"./ExpandMore-Dh8PJJ4O.js";import"./AccordionDetails-SWAG835D.js";import"./index-B9sM2jn7.js";import"./Collapse-EBwNTQD_.js";import"./ListItem-CpM31wZi.js";import"./ListContext-CjbrLwST.js";import"./ListItemIcon-gzyaDDXr.js";import"./ListItemText-DrEGNqUi.js";import"./Tabs-BkmLrgO6.js";import"./KeyboardArrowRight-BsCmT_QI.js";import"./FormLabel-B9HshS0t.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BonvFmn6.js";import"./InputLabel-C6gPgl_H.js";import"./Select-oNdfa4kl.js";import"./Popover-CpvgzvTm.js";import"./MenuItem-BhSAx74W.js";import"./Checkbox-BXTVz8ov.js";import"./SwitchBase-CkQt2ENK.js";import"./Chip-d9Qo2r-R.js";import"./Link-VlZlHdCt.js";import"./useObservable-e6xV4JA9.js";import"./useIsomorphicLayoutEffect-BOIrCsYn.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-DOl7FOOL.js";import"./useDebounce-B_S0ek8W.js";import"./InputAdornment-BYjHfHdP.js";import"./TextField-B2axM_pP.js";import"./useElementFilter-BeZHeFYv.js";import"./EmptyState-DU7GhaJV.js";import"./Progress-DBf8VAmG.js";import"./LinearProgress-BqIZ4vGQ.js";import"./ResponseErrorPanel-BRRLFP_t.js";import"./ErrorPanel-F1yEZWbU.js";import"./WarningPanel-C_8iIf0P.js";import"./MarkdownContent-Cy41HZJg.js";import"./CodeSnippet-CLlJVEMw.js";import"./CopyTextButton-D-U2fpdK.js";import"./useCopyToClipboard-DKocU9ZU.js";import"./Tooltip-1ydGyrcT.js";import"./Popper-KbPRvRer.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
